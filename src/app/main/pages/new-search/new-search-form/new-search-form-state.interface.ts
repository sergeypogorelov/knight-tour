import { IBoard } from "../../../../common/interfaces/board.interface";

export interface NewSearchFormState {
  countOfRows: string;
  countOfColumns: string;
  maxCountOfThreads: string;
  algorithm: string;
  firstMoveBoard: IBoard;
}
