import "./board-row.component.scss";

import * as React from "react";

import { BoardRowProps } from "./board-row-props.interface";

import { BoardCell } from "./board-cell/board-cell.component";

export const BoardRow = (props: BoardRowProps) => {
  return (
    <div className="board-row">
      {props.rowCells.map((cell, columnNumber) => (
        <BoardCell
          key={columnNumber}
          rowNumber={props.rowNumber}
          columnNumber={columnNumber}
          moveNumber={cell}
          onCellClick={props.onCellClick}
        />
      ))}
    </div>
  );
};
