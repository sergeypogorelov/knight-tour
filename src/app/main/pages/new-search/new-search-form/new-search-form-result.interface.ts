import { IBoard } from "../../../../common/interfaces/board.interface";
import { Algorithms } from "../../../../common/enums/algorithms.enum";

export interface NewSearchFormResult {
  maxCountOfThreads: number;
  algorithm: Algorithms;
  firstMoveBoard: IBoard;
}
