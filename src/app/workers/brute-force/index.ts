import { IActionMessage } from "../../common/interfaces/messages/actions/action-message.interface";
import { ISearchStartedMessage } from "../../common/interfaces/messages/notifications/search-started.interface";
import { Notifications } from "../../common/enums/notifications.enum";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { Board } from "../../common/entities/board.class";

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
