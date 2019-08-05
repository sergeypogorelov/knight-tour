import { Notifications } from "../../../common/enums/notifications.enum";
import { SearchStartedHandler } from "./search-started-handler.class";
import { INotificationHandler } from "../../interfaces/notification-handler.interface";

export class NotificationHandlers {
    static instance(notificationType: Notifications): INotificationHandler {
        if (NotificationHandlers._instances[notificationType]) {
            return NotificationHandlers._instances[notificationType];
        }

        switch(notificationType) {
            case Notifications.SearchStarted:
                NotificationHandlers._instances[notificationType] = new SearchStartedHandler();
                break;
            default: throw new Error('Not implemented.');
        }

        return NotificationHandlers._instances[notificationType];
    }

    private static _instances: { [key: number]: INotificationHandler } = {};
}
