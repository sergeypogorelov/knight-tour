import { IMatrixCoordinate } from "../../../../../../common/interfaces/matrix-coordinate.interface";

export interface BoardCellProp {
  moveNumber: number;
  rowNumber: number;
  columnNumber: number;

  onCellClick(coordinate: IMatrixCoordinate): void;
}
