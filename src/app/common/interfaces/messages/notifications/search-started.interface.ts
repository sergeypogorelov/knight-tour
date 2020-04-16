import { Notifications } from "../../../enums/notifications.enum";

import { INotificationMessage } from "./notification-message.interface";
import { IBoard } from "../../board.interface";

export interface ISearchStartedMessage extends INotificationMessage {
  type: Notifications.SearchStarted;
  board: IBoard;
}
