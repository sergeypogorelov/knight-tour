import "./board-numbers.component.scss";

import * as React from "react";

import { BoardNumbersProps } from "./board-numbers-props";

export const BoardNumbers = (props: BoardNumbersProps) => {
  const rowNumbers: number[] = [];

  for (let i = props.countOfNumbers; i > 0; i--) {
    rowNumbers.push(i);
  }

  return (
    <div className="board-cell-numbers">
      {rowNumbers.map((number) => (
        <div key={number} className="board-cell-number">
          {number}
        </div>
      ))}
    </div>
  );
};
