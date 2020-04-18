import { MainActions } from "../../../enums/main-actions.enum";

import { IMainActionMessage } from "./main-action-message.interface";
import { IBoard } from "../../board.interface";

export interface IPrepareMainSearchMessage extends IMainActionMessage {
  type: MainActions.SearchPrepare;
  board: IBoard;
  countOfThreads: number;
}
