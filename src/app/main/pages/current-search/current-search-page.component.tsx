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
      solutionsFound: null,
      movesTaken: null,
      algorithm: null,
    },
    boardInfoItems: [],
  };

  private _mainWorker: BruteForceWorker;

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

    this._mainWorker = new BruteForceWorker();

    this._mainWorker.onmessage = (ev) => {
      const data = ev.data as INotificationMessage;

      console.log(data);

      if (
        data.tag !== MAIN_WORKER_TAG &&
        data.type === Notifications.SearchStarted
      ) {
        const fullData = data as ISearchStartedMessage;

        const threadIndex = +fullData.tag - 1;
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
          boardInfoItems = [
            ...this.state.boardInfoItems,
            {
              solutionsFound: 0,
              movesTaken: 0,
              board: fullData.board,
            },
          ];
        }

        const newState: CurrentSearchPageState = {
          ...this.state,
          boardInfoItems,
        };

        this.setState(newState);
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
}
