import { Main } from "../main.class";
import { INotificationMessage } from "../../../common/interfaces/messages/notifications/notification-message.interface";
import { INotificationHandler } from "../../interfaces/notification-handler.interface";

export class SearchStartedHandler implements INotificationHandler {
    handleNotification(main: Main, message: INotificationMessage) {
        console.log(main, message);
    }
}
