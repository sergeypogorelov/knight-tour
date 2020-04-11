import "./board-letters.component.scss";

import * as React from "react";

import { BoardLetters as BoardLettersEnum } from "../../../../common/enums/board-letters.enum";
import { BoardLettersProps } from "./board-letters-props.interface";

export const BoardLetters = (props: BoardLettersProps) => {
  const columnNumbers: number[] = [];

  for (let i = 1; i <= props.countOfLetters; i++) {
    columnNumbers.push(i);
  }

  return (
    <div className="board-cell-letters">
      {columnNumbers.map((number) => (
        <div key={number} className="board-cell-letter">
          {BoardLettersEnum[number]}
        </div>
      ))}
    </div>
  );
};
