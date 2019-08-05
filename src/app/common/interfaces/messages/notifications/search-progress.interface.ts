import { INotificationMessage } from "./notification-message.interface";
import { Notifications } from "../../../enums/notifications.enum";

export interface ISearchProgressMessage extends INotificationMessage {
    notification: Notifications.SearchProgress;
    movesTaken: number;
    movesUntaken: number;
}
