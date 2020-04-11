import * as React from "react";

import { BoardCellsProps } from "./board-cells-props.interface";

import { BoardRow } from "./board-row/board-row.component";

export const BoardCells = (props: BoardCellsProps) => {
  return (
    <div className="board-cells">
      {props.cells.map((rowCells, rowNumber) => (
        <BoardRow
          key={rowNumber}
          rowCells={rowCells}
          rowNumber={rowNumber}
          onCellClick={props.onCellClick}
        />
      ))}
    </div>
  );
};
