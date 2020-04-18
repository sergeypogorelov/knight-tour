import * as React from "react";
import { Redirect } from "react-router-dom";

import BruteForceWorker from "worker-loader!../../../workers/brute-force";

import { urlFragments } from "../../constants/url-fragments";
import { labels } from "../../constants/labels";

import { IBoard } from "../../../common/interfaces/board.interface";
import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";
import { CurrentSearchPageProps } from "./current-search-page-props.interface";
import { CurrentSearchPageState } from "./current-search-page-state.interface";

import { Board as BoardEntity } from "../../../common/entities/board.class";

import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { SearchInfo } from "./search-info/search-info.component";
import { BoardInfo } from "./board-info/board-info.component";
import { Actions } from "../../../common/enums/actions.enum";
import { IStartSearchMessage } from "../../../common/interfaces/messages/actions/start-search-message.interface";
import { INotificationMessage } from "../../../common/interfaces/messages/notifications/notification-message.interface";
import { Notifications } from "../../../common/enums/notifications.enum";
import { ISearchStartedMessage } from "../../../common/interfaces/messages/notifications/search-started.interface";
import { BoardInfoProps } from "./board-info/board-info-props.interface";
import { ISearchProgressMessage } from "../../../common/interfaces/messages/notifications/search-progress.interface";
import { Algorithms } from "../../../common/enums/algorithms.enum";
import { SearchInfoProps } from "./search-info/search-info-props.interface";
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";
import { ISearchResultMessage } from "../../../common/interfaces/messages/notifications/search-result.interface";

const MAIN_WORKER_TAG = "main";

export class CurrentSearchPage extends React.Component<
  CurrentSearchPageProps,
  CurrentSearchPageState
> {
  state: CurrentSearchPageState = {
    breadcrumb: {
      items: [],
    },
    searchInfo: {
      solutionsFound: 0,
      movesTaken: 0,
      algorithm: Algorithms.bruteForce,
    },
    boardInfoItems: [],
  };

  private _mainWorker: BruteForceWorker;

  private _totalSolutionsFound: number;
  private _totalMovesTaken: number;

  private _solutionsFoundPerThread: IBoard[][];
  private _movesTakenPerThread: number[];

  componentDidMount() {
    this.setBreadcrumb();
    this.startSearch();
  }

  componentWillUnmount() {
    if (this._mainWorker) {
      this._mainWorker.terminate();
    }
  }

  render() {
    if (!this.props.fullSearchInfo) {
      return <Redirect to={`/${urlFragments.newSearch}`} />;
    }

    return (
      <div>
        <BreadcrumbComponent items={this.state.breadcrumb.items} />
        <div className="container">
          <h2>Current Search</h2>
          <SearchInfo {...this.state.searchInfo} />
          <div>
            <button className="btn btn-primary" type="button">
              Show Random Solution
            </button>
            <button className="btn btn-danger ml-2" type="button">
              Stop
            </button>
          </div>
          <div className="d-flex flex-wrap justify-content-between mt-4">
            {this.state.boardInfoItems.map((item, index) => (
              <BoardInfo key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  private setBreadcrumb() {
    const partialState: { breadcrumb: BreadcrumbProps } = {
      breadcrumb: {
        items: [
          {
            to: `/${urlFragments.home}`,
            label: labels.home,
          },
          {
            to: `/${urlFragments.currentSearch}`,
            label: labels.currentSearch,
          },
        ],
      },
    };

    const state: CurrentSearchPageState = {
      ...this.state,
      ...partialState,
    };

    this.setState(state);
  }

  private startSearch() {
    if (!this.props.fullSearchInfo) {
      return;
    }

    this.prepareSearch();

    this._mainWorker = new BruteForceWorker();

    this._mainWorker.onmessage = (ev) => {
      const data = ev.data as INotificationMessage;

      // console.log(data);

      if (data.tag === MAIN_WORKER_TAG) {
        return;
      }

      if (data.type === Notifications.SearchStarted) {
        this.handleSearchStarted(data as ISearchStartedMessage);
      } else if (data.type === Notifications.SearchProgress) {
        this.handleSearchProgress(data as ISearchProgressMessage);
      } else if (data.type === Notifications.SearchResult) {
        this.handleSearchResult(data as ISearchResultMessage);
      } else if (data.type === Notifications.SearchStopped) {
        this.handleSearchStopped(data as ISearchStoppedMessage);
      }
    };

    this._mainWorker.onerror = (ev) => console.error(ev);

    const message: IStartSearchMessage = {
      type: Actions.SearchStart,
      tag: MAIN_WORKER_TAG,
      board: this.props.fullSearchInfo.firstMoveBoard,
      maxThreadCount: this.props.fullSearchInfo.maxCountOfThreads,
    };

    this._mainWorker.postMessage(message);
  }

  private handleSearchStarted(data: ISearchStartedMessage) {
    const fullData = data as ISearchStartedMessage;

    const threadIndex = +fullData.tag - 1;

    if (!this._solutionsFoundPerThread[threadIndex]) {
      this._solutionsFoundPerThread[threadIndex] = [];
    }

    if (!this._movesTakenPerThread[threadIndex]) {
      this._movesTakenPerThread[threadIndex] = 0;
    }

    const boardInfoItem = this.state.boardInfoItems[threadIndex] || null;

    let boardInfoItems: BoardInfoProps[];
    if (boardInfoItem) {
      boardInfoItems = this.state.boardInfoItems.map((i) => {
        if (i !== boardInfoItem) {
          return i;
        }

        return {
          ...i,
          board: fullData.board,
        };
      });
    } else {
      boardInfoItems = [...this.state.boardInfoItems];

      boardInfoItems[threadIndex] = {
        solutionsFound: this._solutionsFoundPerThread[threadIndex].length,
        movesTaken: this._movesTakenPerThread[threadIndex],
        board: fullData.board,
      };
    }

    const newState: CurrentSearchPageState = {
      ...this.state,
      boardInfoItems,
    };

    this.setState(newState);
  }

  private handleSearchProgress(data: ISearchProgressMessage) {
    const fullData = data as ISearchProgressMessage;

    const threadIndex = +fullData.tag - 1;
    const newBoardInfoItems = this.state.boardInfoItems.map((item, index) => {
      if (index !== threadIndex) {
        return item;
      }

      return {
        ...item,
        movesTaken:
          this._movesTakenPerThread[threadIndex] + fullData.movesTaken,
      };
    });

    const newState: CurrentSearchPageState = {
      ...this.state,
      boardInfoItems: newBoardInfoItems,
    };

    this.setState(newState);
    this.setSearchInfoState();
  }

  private handleSearchResult(data: ISearchResultMessage) {
    const fullData = data as ISearchResultMessage;

    const threadIndex = +fullData.tag - 1;

    this._solutionsFoundPerThread[threadIndex].push(data.board);

    const newBoardInfoItems = this.state.boardInfoItems.map((item, index) => {
      if (index !== threadIndex) {
        return item;
      }

      return {
        ...item,
        solutionsFound: this._solutionsFoundPerThread[threadIndex].length,
      };
    });

    const newState: CurrentSearchPageState = {
      ...this.state,
      boardInfoItems: newBoardInfoItems,
    };

    this.setState(newState);
    this.setSearchInfoState();
  }

  private handleSearchStopped(data: ISearchStoppedMessage) {
    const fullData = data as ISearchStoppedMessage;

    const threadIndex = +fullData.tag - 1;

    this._movesTakenPerThread[threadIndex] += fullData.countOfMoves;

    const newBoardInfoItems = this.state.boardInfoItems.map((item, index) => {
      if (index !== threadIndex) {
        return item;
      }

      return {
        ...item,
        movesTaken: this._movesTakenPerThread[threadIndex],
      };
    });

    const newState: CurrentSearchPageState = {
      ...this.state,
      boardInfoItems: newBoardInfoItems,
    };

    this.setState(newState);
    this.setSearchInfoState();
  }

  private prepareSearch() {
    this.resetSearchState();

    if (this._mainWorker) {
      this._mainWorker.terminate();
      this._mainWorker = null;
    }

    this._totalSolutionsFound = 0;
    this._totalMovesTaken = 0;

    this._solutionsFoundPerThread = [];
    this._movesTakenPerThread = [];
  }

  private resetSearchState() {
    const searchState: Partial<CurrentSearchPageState> = {
      searchInfo: {
        solutionsFound: 0,
        movesTaken: 0,
        algorithm: Algorithms.bruteForce,
      },
      boardInfoItems: [],
    };

    const newState: CurrentSearchPageState = {
      ...this.state,
      ...searchState,
    };

    this.setState(newState);
  }

  private setSearchInfoState() {
    let solutionsFound = 0;
    let movesTaken = 0;

    this.state.boardInfoItems.forEach((i) => {
      solutionsFound += i.solutionsFound;
      movesTaken += i.movesTaken;
    });

    const searchInfo: SearchInfoProps = {
      solutionsFound,
      movesTaken,
      algorithm: this.state.searchInfo.algorithm,
    };

    const newState: CurrentSearchPageState = {
      ...this.state,
      searchInfo,
    };

    this.setState(newState);
  }
}
