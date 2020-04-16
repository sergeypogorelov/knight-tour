import { Algorithms } from "../enums/algorithms.enum";

import { IBoard } from "./board.interface";

export interface IFullSearchInfo {
  algorithm: Algorithms;
  firstMoveBoard: IBoard;
  maxCountOfThreads: number;
}
