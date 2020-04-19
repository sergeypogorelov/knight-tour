import { IBoard } from "../../../../common/interfaces/board.interface";

export interface NewSearchFormState {
  submitButtonDisabled: boolean;
  countOfRows: string;
  countOfColumns: string;
  maxCountOfThreads: string;
  algorithm: string;
  firstMoveBoard: IBoard;
}
