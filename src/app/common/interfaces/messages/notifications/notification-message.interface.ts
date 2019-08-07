import { Notifications } from "../../../enums/notifications.enum";

export interface INotificationMessage {
    tag: string;
    type: Notifications;
}
