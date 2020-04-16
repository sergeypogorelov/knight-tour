import * as React from "react";

import { IBoard } from "../../../../common/interfaces/board.interface";
import { NewSearchFormProps } from "./new-search-form-props.interface";
import { NewSearchFormState } from "./new-search-form-state.interface";
import { NewSearchFormResult } from "./new-search-form-result.interface";

import { Algorithms } from "../../../../common/enums/algorithms.enum";

import { Board as BoardEntity } from "../../../../common/entities/board.class";

import { Board } from "../../../shared/board/board.component";

export class NewSearchForm extends React.Component<
  NewSearchFormProps,
  NewSearchFormState
> {
  constructor(props: NewSearchFormProps) {
    super(props);

    this.state = this.generateDefaultState(4, 4);
  }

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-row">
          <div className="form-group col">
            <label>Count of rows</label>
            <select
              className="form-control"
              name="countOfRows"
              value={this.state.countOfRows}
              onChange={this.handleControlChange}
            >
              <option>4</option>
              <option>5</option>
              <option>6</option>
            </select>
          </div>
          <div className="form-group col">
            <label>Max count of threads</label>
            <select
              className="form-control"
              name="maxCountOfThreads"
              value={this.state.maxCountOfThreads}
              onChange={this.handleControlChange}
            >
              <option>1</option>
              <option>2</option>
              <option>4</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col">
            <label>Count of columns</label>
            <select
              className="form-control"
              name="countOfColumns"
              value={this.state.countOfColumns}
              onChange={this.handleControlChange}
            >
              <option>4</option>
              <option>5</option>
              <option>6</option>
            </select>
          </div>
          <div className="form-group col">
            <label>Algorithm</label>
            <select
              className="form-control"
              name="algorithm"
              value={this.state.algorithm}
              onChange={this.handleControlChange}
            >
              <option>Brute Force</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col">
            <label>First move</label>
            <Board
              value={this.state.firstMoveBoard}
              onChange={this.handleBoardChange}
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>
    );
  }

  handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const { maxCountOfThreads, algorithm, firstMoveBoard } = this.state;

    const result: NewSearchFormResult = {
      maxCountOfThreads: Number(maxCountOfThreads),
      algorithm: algorithm as Algorithms,
      firstMoveBoard,
    };

    this.props.onSubmit(result);
  };

  handleControlChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = ev.target;

    let newState: NewSearchFormState = {
      ...this.state,
      [name]: value,
    };

    if (name === "countOfRows" || name === "countOfColumns") {
      newState.firstMoveBoard = this.generateEmptyBoard(
        Number(newState.countOfRows),
        Number(newState.countOfColumns)
      );
    }

    this.setState(newState);
  };

  handleBoardChange = (board: IBoard) => {
    const newState: NewSearchFormState = {
      ...this.state,
      firstMoveBoard: board,
    };

    this.setState(newState);
  };

  private generateDefaultState(
    countOfRows: number,
    countOfColumns: number
  ): NewSearchFormState {
    const firstMoveBoard = this.generateEmptyBoard(countOfRows, countOfColumns);

    return {
      countOfRows: String(countOfRows),
      countOfColumns: String(countOfColumns),
      maxCountOfThreads: "1",
      algorithm: "Brute Force", /// TODO: replace hardcoded strings with enum
      firstMoveBoard,
    };
  }

  private generateEmptyBoard(
    countOfRows: number,
    countOfColumns: number
  ): IBoard {
    const emptyCells = BoardEntity.generateUntouchedCells(
      countOfColumns,
      countOfRows
    );

    return {
      cells: emptyCells,
    };
  }
}
