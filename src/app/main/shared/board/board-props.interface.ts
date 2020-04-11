import { IBoard } from "../../../common/interfaces/board.interface";

export interface BoardProps {
  value: IBoard;
  readonly?: boolean;

  onChange?: (value: IBoard) => void;
}
