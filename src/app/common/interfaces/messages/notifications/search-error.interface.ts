import { INotificationMessage } from "./notification-message.interface";
import { Notifications } from "../../../enums/notifications.enum";

export interface ISearchErrorMessage extends INotificationMessage {
    type: Notifications.SearchError;
    message: string;
}
