import { IBoard } from "../../../../common/interfaces/board.interface";

export interface NewSearchFormResult {
  countOfRows: number;
  countOfColumns: number;
  maxCountOfThreads: number;
  algorithm: string;
  firstMoveBoard: IBoard;
}
