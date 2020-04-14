import * as React from "react";

import { urlFragments } from "../../constants/url-fragments";
import { labels } from "../../constants/labels";

import { IBoard } from "../../../common/interfaces/board.interface";
import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";
import { CurrentSearchPageState } from "./current-search-page-state.interface";

import { Board as BoardEntity } from "../../../common/entities/board.class";

import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { SearchInfo } from "./search-info/search-info.component";
import { BoardInfo } from "./board-info/board-info.component";

export class CurrentSearchPage extends React.Component<
  object,
  CurrentSearchPageState
> {
  state: CurrentSearchPageState = {
    breadcrumb: {
      items: [],
    },
    searchInfo: {
      solutionsFound: 15,
      movesTaken: 4567,
      algorithm: "Brute Force",
    },
  };

  componentDidMount() {
    this.setBreadcrumb();
  }

  render() {
    const board: IBoard = {
      cells: BoardEntity.generateUntouchedCells(8, 8),
    };

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
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
            <BoardInfo board={board} solutionsFound={7} movesTaken={2053} />
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
