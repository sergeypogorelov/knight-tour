import { IBoard } from "../../board.interface";
import { INotificationMessage } from "./notification-message.interface";
import { Notifications } from "../../../enums/notifications.enum";

export interface ISearchResultMessage extends INotificationMessage {
    type: Notifications.SearchResult;
    board: IBoard;
}
