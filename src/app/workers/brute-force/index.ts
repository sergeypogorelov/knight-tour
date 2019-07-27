import { IActionMessage } from "../../interfaces/messages/actions/action-message.interface";
import { ISearchStartedMessage } from "../../interfaces/messages/notifications/search-started.interface";
import { Notifications } from "../../enums/notifications.enum";

const ctx: Worker = self as any;

ctx.addEventListener('message', ev => {
    const actionMessage = ev.data as IActionMessage;
    console.log(actionMessage);

    const notificationMessage: ISearchStartedMessage = {
        notification: Notifications.SearchStarted
    };
    ctx.postMessage(notificationMessage);
});


