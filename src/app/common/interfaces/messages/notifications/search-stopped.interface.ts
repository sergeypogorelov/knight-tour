import { INotificationMessage } from "./notification-message.interface";
import { Notifications } from "../../../enums/notifications.enum";

export interface ISearchStartedMessage extends INotificationMessage {
    notification: Notifications.SearchStopped;
}
