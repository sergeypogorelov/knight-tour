import { IActionMessage } from "../../interfaces/messages/actions/action-message.interface";
import { ISearchStartedMessage } from "../../interfaces/messages/notifications/search-started.interface";
import { Notifications } from "../../enums/notifications.enum";
import { IStartSearchMessage } from "../../interfaces/messages/actions/start-search-message.interface";
import { Board } from "../../entities/board.class";

const ctx: Worker = self as any;

ctx.addEventListener('message', ev => {
    const actionMessage = ev.data as IActionMessage;
    const startSearchMessage = actionMessage as IStartSearchMessage;
    const board = Board.createFromJSON(startSearchMessage.board);
    console.log(board);

    const notificationMessage: ISearchStartedMessage = {
        notification: Notifications.SearchStarted
    };
    ctx.postMessage(notificationMessage);
});
