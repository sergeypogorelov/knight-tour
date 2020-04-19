import BruteForceWorker from "worker-loader!./search";

import { MainNotifications } from "../../common/enums/main-notifications.enum";
import { MainActions } from "../../common/enums/main-actions.enum";
import { Notifications } from "../../common/enums/notifications.enum";
import { Actions } from "../../common/enums/actions.enum";

import { IBoard } from "../../common/interfaces/board.interface";

import { IMainActionMessage } from "../../common/interfaces/main-messages/actions/main-action-message.interface";
import { IPrepareMainSearchMessage } from "../../common/interfaces/main-messages/actions/prepare-main-search-message.interface";
import { IStartMainSearchMessage } from "../../common/interfaces/main-messages/actions/start-main-search-message.interface";
import { IStopMainSearchMessage } from "../../common/interfaces/main-messages/actions/stop-main-search-message.interface";
import { IMainSearchPreparedMessage } from "../../common/interfaces/main-messages/notifications/main-search-prepared-message.interface";
import { IMainSearchStartedMessage } from "../../common/interfaces/main-messages/notifications/main-search-started-message.interface";
import { IMainSearchReportMessage } from "../../common/interfaces/main-messages/notifications/main-search-report-message.interface";
import { IMainSearchStoppedMessage } from "../../common/interfaces/main-messages/notifications/main-search-stopped-message.interface";

import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { INotificationMessage } from "../../common/interfaces/messages/notifications/notification-message.interface";
import { ISearchStartedMessage } from "../../common/interfaces/messages/notifications/search-started.interface";
import { ISearchProgressMessage } from "../../common/interfaces/messages/notifications/search-progress.interface";
import { ISearchResultMessage } from "../../common/interfaces/messages/notifications/search-result.interface";
import { ISearchStoppedMessage } from "../../common/interfaces/messages/notifications/search-stopped.interface";

import { Knight } from "../../common/entities/knight.class";
import { Board } from "../../common/entities/board.class";

interface ISearchStatus {
  movesTakenPerThread: number[];
  movesTakenWithProgressPerThread: number[];
  boardsSolvingPerThread: IBoard[];
  solutionsFoundPerThread: IBoard[][];
}

const ctx: Worker = self as any;

let searchPrepared: boolean;
let searchInProgress: boolean;
let searchCompleted: boolean;

let intervalId: NodeJS.Timer;

let searchStatus: ISearchStatus;

let boardsToSolve: Board[];
let newSolutionsFoundPerThread: IBoard[][];

let workers: Worker[];
let workersActive: boolean[];

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
  if (searchInProgress) {
    throw new Error("The search is already in progress.");
  }

  const knight = new Knight(Board.createFromJSON(data.board));
  boardsToSolve = generateBoardsToSolve(knight, data.countOfThreads);

  workers = [];
  workersActive = [];

  newSolutionsFoundPerThread = [];

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

  searchPrepared = true;
  searchCompleted = false;
}

function mainSearchStartHandler(data: IStartMainSearchMessage) {
  if (!searchPrepared) {
    throw new Error("The search should be prepared first.");
  }

  if (searchInProgress) {
    throw new Error("The search is already in progress.");
  }

  runWorkers();
  runInterval(data.reportInterval);

  const message: IMainSearchStartedMessage = {
    type: MainNotifications.SearchStarted,
  };

  ctx.postMessage(message);

  searchInProgress = true;
}

function mainSearchStopHandler(data: IStopMainSearchMessage) {
  if (!searchInProgress) {
    throw new Error("The search is not in progress.");
  }

  searchPrepared = false;
  searchInProgress = false;
  searchCompleted = true;
}

function runWorkers() {
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

  if (!newSolutionsFoundPerThread[index]) {
    newSolutionsFoundPerThread[index] = [];
  }

  newSolutionsFoundPerThread[index].push(data.board);
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

function runInterval(reportInterval: number) {
  intervalId = setInterval(() => {
    let totalSolutionsFound = 0;
    let totalMovesTaken = 0;

    for (let i = 0; i < workers.length; i++) {
      totalSolutionsFound += searchStatus.solutionsFoundPerThread[i].length;
      totalMovesTaken += searchStatus.movesTakenWithProgressPerThread[i];
    }

    const solutionsFoundCountPerThread = searchStatus.solutionsFoundPerThread.map(
      (i) => i.length
    );

    const reportMessage: IMainSearchReportMessage = {
      type: MainNotifications.SearchReport,
      totalSolutionsFound,
      totalMovesTaken,
      newSolutionsFoundPerThread,
      solutionsFoundCountPerThread,
      movesTakenCountPerThread: searchStatus.movesTakenWithProgressPerThread,
      boardsPerThread: searchStatus.boardsSolvingPerThread,
    };

    newSolutionsFoundPerThread = [];

    if (searchCompleted) {
      clearInterval(intervalId);

      workers.forEach((i) => i.terminate());

      const stopMessage: IMainSearchStoppedMessage = {
        type: MainNotifications.SearchStopped,
        lastReport: reportMessage,
      };

      ctx.postMessage(stopMessage);
    } else {
      ctx.postMessage(reportMessage);
    }
  }, reportInterval);
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
