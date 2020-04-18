import BruteForceWorker from "worker-loader!./search";

import { IMainActionMessage } from "../../common/interfaces/main-messages/actions/main-action-message.interface";
import { MainActions } from "../../common/enums/main-actions.enum";
import { IPrepareMainSearchMessage } from "../../common/interfaces/main-messages/actions/prepare-main-search-message.interface";
import { IStartMainSearchMessage } from "../../common/interfaces/main-messages/actions/start-main-search-message.interface";
import { IStopMainSearchMessage } from "../../common/interfaces/main-messages/actions/stop-main-search-message.interface";
import { Knight } from "../../common/entities/knight.class";
import { Board } from "../../common/entities/board.class";
import { IMainSearchPreparedMessage } from "../../common/interfaces/main-messages/notifications/main-search-prepared-message.interface";
import { MainNotifications } from "../../common/enums/main-notifications.enum";
import { IBoard } from "../../common/interfaces/board.interface";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { Actions } from "../../common/enums/actions.enum";
import { INotificationMessage } from "../../common/interfaces/messages/notifications/notification-message.interface";
import { Notifications } from "../../common/enums/notifications.enum";
import { ISearchProgressMessage } from "../../common/interfaces/messages/notifications/search-progress.interface";
import { ISearchResultMessage } from "../../common/interfaces/messages/notifications/search-result.interface";
import { ISearchStoppedMessage } from "../../common/interfaces/messages/notifications/search-stopped.interface";
import { IMainSearchReportMessage } from "../../common/interfaces/main-messages/notifications/main-search-report-message.interface";
import { ISearchStartedMessage } from "../../common/interfaces/messages/notifications/search-started.interface";

interface ISearchStatus {
  movesTakenPerThread: number[];
  movesTakenWithProgressPerThread: number[];
  boardsSolvingPerThread: IBoard[];
  solutionsFoundPerThread: IBoard[][];
}

const ctx: Worker = self as any;

let searchCompleted: boolean;

let boardsToSolve: Board[];
let solutionsPerThread: IBoard[][];

let workers: Worker[];
let workersActive: boolean[];

let searchStatus: ISearchStatus;

let intervalId: NodeJS.Timer;

ctx.onmessage = (ev) => {
  const evData = ev.data as IMainActionMessage;

  switch (evData.type) {
    case MainActions.SearchPrepare:
      mainSearchPrepareHandler(evData as IPrepareMainSearchMessage);
      break;
    case MainActions.SearchStart:
      mainSearchStartHandler(evData as IStartMainSearchMessage);
      break;
    case MainActions.SearchStop:
      mainSearchStopHandler(evData as IStopMainSearchMessage);
      break;
  }
};

ctx.onerror = (error) => console.error(error);

function mainSearchPrepareHandler(data: IPrepareMainSearchMessage) {
  if (workers) {
    throw new Error("Workers have been already initilized.");
  }

  const knight = new Knight(Board.createFromJSON(data.board));
  boardsToSolve = generateBoardsToSolve(knight, data.countOfThreads);

  searchCompleted = false;

  workers = [];
  workersActive = [];

  solutionsPerThread = [];

  searchStatus = {
    movesTakenPerThread: [],
    movesTakenWithProgressPerThread: [],
    boardsSolvingPerThread: [],
    solutionsFoundPerThread: [],
  };

  for (let i = 0; i < data.countOfThreads; i++) {
    workers.push(new BruteForceWorker());
    workersActive.push(false);

    searchStatus.movesTakenPerThread.push(0);
    searchStatus.movesTakenWithProgressPerThread.push(0);
    searchStatus.solutionsFoundPerThread.push([]);
  }

  const boardsPerThread = boardsToSolve
    .slice(0, data.countOfThreads)
    .map((i) => i.asJSON());

  const message: IMainSearchPreparedMessage = {
    type: MainNotifications.SearchPrepared,
    boardsPerThread,
  };

  ctx.postMessage(message);
}

function mainSearchStartHandler(data: IStartMainSearchMessage) {
  workers.forEach((worker, index) => {
    worker.onmessage = (ev) => {
      const evData = ev.data as INotificationMessage;

      switch (evData.type) {
        case Notifications.SearchStarted:
          searchStartedHandler(evData as ISearchStartedMessage);
          break;
        case Notifications.SearchProgress:
          searchProgressHandler(evData as ISearchProgressMessage);
          break;
        case Notifications.SearchResult:
          searchResultHandler(evData as ISearchResultMessage);
          break;
        case Notifications.SearchStopped:
          searchStoppedHandler(evData as ISearchStoppedMessage);
          break;
      }
    };

    worker.onerror = (error) => console.error(error);

    const boardToSolve = boardsToSolve.shift();

    const message = generateStartSearchMessage(
      String(index),
      boardToSolve.asJSON()
    );

    worker.postMessage(message);
    workersActive[index] = true;
  });

  intervalId = setInterval(() => {
    let totalSolutionsFound = 0;
    let totalMovesTaken = 0;

    for (let i = 0; i < workers.length; i++) {
      totalSolutionsFound += searchStatus.solutionsFoundPerThread[i].length;
      totalMovesTaken += searchStatus.movesTakenWithProgressPerThread[i];
    }

    const message: IMainSearchReportMessage = {
      type: MainNotifications.SearchReport,
      totalSolutionsFound,
      totalMovesTaken,
      newSolutionsFoundPerThread: solutionsPerThread,
      solutionsFoundCountPerThread: searchStatus.solutionsFoundPerThread.map(
        (i) => i.length
      ),
      movesTakenCountPerThread: searchStatus.movesTakenWithProgressPerThread,
      boardsPerThread: searchStatus.boardsSolvingPerThread,
    };

    solutionsPerThread = [];
    for (let i = 0; i < workers.length; i++) {
      solutionsPerThread[i] = [];
    }

    ctx.postMessage(message);

    if (searchCompleted) {
      clearInterval(intervalId);
    }
  }, data.reportInterval);
}

function mainSearchStopHandler(data: IStopMainSearchMessage) {
  workers.forEach((i) => i.terminate());
}

function searchStartedHandler(data: ISearchStartedMessage) {
  const index = +data.tag;

  searchStatus.boardsSolvingPerThread[index] = data.board;
}

function searchProgressHandler(data: ISearchProgressMessage) {
  const index = +data.tag;

  searchStatus.movesTakenWithProgressPerThread[index] =
    searchStatus.movesTakenPerThread[index] + data.movesTaken;
}

function searchResultHandler(data: ISearchResultMessage) {
  const index = +data.tag;
  searchStatus.solutionsFoundPerThread[index].push(data.board);

  solutionsPerThread[index].push(data.board);
}

function searchStoppedHandler(data: ISearchStoppedMessage) {
  const index = +data.tag;

  searchStatus.movesTakenPerThread[index] += data.countOfMoves;
  searchStatus.movesTakenWithProgressPerThread[index] =
    searchStatus.movesTakenPerThread[index];

  const boardToSolve = boardsToSolve.shift();
  if (boardToSolve) {
    const message = generateStartSearchMessage(
      String(index),
      boardToSolve.asJSON()
    );

    workers[index].postMessage(message);
  } else {
    workersActive[index] = false;

    if (workersActive.every((i) => !i)) {
      searchCompleted = true;
    }
  }
}

/**
 * generates boards to solve
 * @param knight current chess knight
 * @param minCount min count of boards to generate
 */
function generateBoardsToSolve(knight: Knight, minCount: number) {
  let boardsToSolve: Board[] = [];

  let depth = 0;

  do {
    depth++;

    boardsToSolve = knight.findAllMovesCombinations(depth);
  } while (boardsToSolve.length < minCount);

  return boardsToSolve;
}

/**
 * generates message saying to workers to start searching
 * @param tag worker tag
 * @param board board to solve
 */
function generateStartSearchMessage(
  tag: string,
  board: IBoard
): IStartSearchMessage {
  const type = Actions.SearchStart;
  const maxThreadCount: number = null;

  return {
    tag,
    type,
    board,
    maxThreadCount,
  };
}
