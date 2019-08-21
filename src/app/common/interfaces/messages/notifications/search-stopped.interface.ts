import { INotificationMessage } from "./notification-message.interface";
import { Notifications } from "../../../enums/notifications.enum";

export interface ISearchStoppedMessage extends INotificationMessage {
    type: Notifications.SearchStopped;
    countOfMoves: number;
}
