import "./board-cell.component.scss";

import * as React from "react";
import { useCallback } from "react";
import classNames from "classnames";

import { IMatrixCoordinate } from "../../../../../../common/interfaces/matrix-coordinate.interface";
import { BoardCellProp } from "./board-cell-prop.interface";

import { Board as BoardEntity } from "../../../../../../common/entities/board.class";

export const BoardCell = (props: BoardCellProp) => {
  const { rowNumber, columnNumber } = props;

  const handleCellClick = useCallback(() => {
    const coordinate: IMatrixCoordinate = {
      row: rowNumber,
      column: columnNumber,
    };

    props.onCellClick(coordinate);
  }, [rowNumber, columnNumber]);

  const isLight =
    (rowNumber % 2 === 0 && columnNumber % 2 === 0) ||
    (rowNumber % 2 !== 0 && columnNumber % 2 !== 0);

  const className = classNames({
    "board-cell": true,
    light: isLight,
    dark: !isLight,
  });

  const formatMove = (moveNumber: number) => {
    if (moveNumber === BoardEntity.untouchedCellValue) {
      return "";
    }

    return moveNumber + 1;
  };

  return (
    <div className={className} onClick={handleCellClick}>
      {formatMove(props.moveNumber)}
    </div>
  );
};
