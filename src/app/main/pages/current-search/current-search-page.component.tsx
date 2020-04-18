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
import { IPrepareMainSearchMessage } from "../../../common/interfaces/main-messages/actions/prepare-main-search-message.interface";
import { MainActions } from "../../../common/enums/main-actions.enum";
import { IStartMainSearchMessage } from "../../../common/interfaces/main-messages/actions/start-main-search-message.interface";

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
      algorithm: Algorithms.BruteForce,
    },
    boardInfoItems: [],
  };

  private _mainWorker: BruteForceWorker;

  componentDidMount() {
    this.setBreadcrumb();

    const mainWorker = new BruteForceWorker();

    mainWorker.onmessage = (ev) => console.log(ev.data);
    // mainWorker.onerror = (err) => console.error(err);

    const prepareMessage: IPrepareMainSearchMessage = {
      type: MainActions.SearchPrepare,
      board: this.props.fullSearchInfo.firstMoveBoard,
      countOfThreads: this.props.fullSearchInfo.maxCountOfThreads,
    };

    mainWorker.postMessage(prepareMessage);

    setTimeout(() => {
      const startMessage: IStartMainSearchMessage = {
        type: MainActions.SearchStart,
        reportInterval: 20,
      };

      mainWorker.postMessage(startMessage);
    });
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
}
