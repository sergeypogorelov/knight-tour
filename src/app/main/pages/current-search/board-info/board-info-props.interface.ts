import { IBoard } from "../../../../common/interfaces/board.interface";

export interface BoardInfoProps {
  board: IBoard;
  solutionsFound: number;
  movesTaken: number;
}
