import { IMatrixCoordinate } from "../../../../../common/interfaces/matrix-coordinate.interface";

export interface BoardRowProps {
  rowNumber: number;
  rowCells: number[];

  onCellClick(coordinate: IMatrixCoordinate): void;
}
