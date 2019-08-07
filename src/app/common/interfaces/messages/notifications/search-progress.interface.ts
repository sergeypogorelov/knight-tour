import { INotificationMessage } from "./notification-message.interface";
import { Notifications } from "../../../enums/notifications.enum";

export interface ISearchProgressMessage extends INotificationMessage {
    type: Notifications.SearchProgress;
    movesTaken: number;
    movesUntaken: number;
}
