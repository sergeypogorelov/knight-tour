import * as React from "react";

import { BoardInfoProps } from "./board-info-props.interface";

import { Board } from "../../../shared/board/board.component";

export const BoardInfo = (props: BoardInfoProps) => {
  return (
    <div className="card mb-4">
      <div className="pl-1 pr-2 pt-3">
        <Board value={props.board} readonly />
      </div>
      <div className="card-body">
        <h5 className="card-title mb-1">In Progress</h5>
        <div className="card-text mb-3">
          <p className="mb-0">Solutions found: {props.solutionsFound}</p>
          <p className="mb-0">Moves taken: {props.movesTaken}</p>
        </div>
      </div>
    </div>
  );
};
