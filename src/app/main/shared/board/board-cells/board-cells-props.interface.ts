import { IMatrixCoordinate } from "../../../../common/interfaces/matrix-coordinate.interface";

export interface BoardCellsProps {
  cells: number[][];
  onCellClick(coordinate: IMatrixCoordinate): void;
}
