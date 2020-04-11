import "./board.component.scss";

import * as React from "react";
import classNames from "classnames";

import { IMatrixCoordinate } from "../../../common/interfaces/matrix-coordinate.interface";
import { BoardProps } from "./board-props.interface";

import { Board as BoardEntity } from "../../../common/entities/board.class";

import { BoardNumbers } from "./board-numbers/board-numbers.component";
import { BoardCells } from "./board-cells/board-cells.component";
import { BoardLetters } from "./board-letters/board-letters.component";

export class Board extends React.Component<BoardProps> {
  render() {
    let cells: number[][];

    if (this.props.value) {
      cells = this.props.value.cells;
    } else {
      cells = [];
    }

    let rowsCount = 0;
    let columnsCount = 0;

    if (cells.length > 0) {
      rowsCount = cells.length;
      columnsCount = cells[0].length;
    }

    const className = classNames({
      board: true,
      readonly: Boolean(this.props.readonly),
    });

    return (
      <div className={className}>
        <div className="board-top">
          <BoardNumbers countOfNumbers={rowsCount} />
          <BoardCells cells={cells} onCellClick={this.handleCellClick} />
        </div>
        <BoardLetters countOfLetters={columnsCount} />
      </div>
    );
  }

  handleCellClick = (coordinate: IMatrixCoordinate) => {
    if (this.props.readonly) {
      return;
    }

    const width = this.getCountOfColumns();
    const height = this.getCountOfRows();
    const cells = BoardEntity.generateUntouchedCells(width, height);

    cells[coordinate.row][coordinate.column] = BoardEntity.startingCellValue;

    this.props.onChange({ cells });
  };

  private getCountOfRows(): number {
    if (!this.props.value) {
      return 0;
    }

    return this.props.value.cells.length;
  }

  private getCountOfColumns(): number {
    if (!this.props.value) {
      return 0;
    }

    const cells = this.props.value.cells;

    return cells.length > 0 ? cells[0].length : 0;
  }
}
