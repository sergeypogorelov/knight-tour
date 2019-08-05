import BruteForceWorker from 'worker-loader!../../workers/brute-force';

import { INotificationMessage } from "../../common/interfaces/messages/notifications/notification-message.interface";
import { NotificationHandlers } from "./notification-handlers/notification-handlers.class";

export class Main {
    constructor() {
        const worker = new BruteForceWorker();
        worker.addEventListener('message', ev => this.handleNotification(ev.data));
    }

    handleNotification(message: INotificationMessage) {
        const handler = NotificationHandlers.instance(message.notification);
        handler.handleNotification(this, message);
    }
}
