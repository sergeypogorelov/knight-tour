import { MainNotifications } from "../../../enums/main-notifications.enum";
import { IBoard } from "../../board.interface";

export interface IMainSearchPreparedMessage {
  type: MainNotifications.SearchPrepared;
  boardsPerThread: IBoard[];
}
