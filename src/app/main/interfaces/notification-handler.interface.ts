import { Main } from "../entities/main.class";
import { INotificationMessage } from "../../common/interfaces/messages/notifications/notification-message.interface";

export interface INotificationHandler {
    handleNotification(main: Main, message: INotificationMessage): void;
}
