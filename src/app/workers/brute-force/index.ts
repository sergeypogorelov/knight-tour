import { IActionMessage } from "../../common/interfaces/messages/actions/action-message.interface";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { ISearchErrorMessage } from "../../common/interfaces/messages/notifications/search-error.interface";

import { Actions } from "../../common/enums/actions.enum";
import { Notifications } from "../../common/enums/notifications.enum";

import { Board } from "../../common/entities/board.class";
import { Knight } from "../../common/entities/knight.class";
import { Delegator } from './entities/delegator.class';

const ctx: Worker = self as any;

let tag: string;

ctx.addEventListener('message', message => {
    const messageData = message.data as IActionMessage;

    tag = messageData.tag;

    if (messageData.type === Actions.SearchStart) {
        const actionMessage = messageData as IStartSearchMessage;

        const knight = new Knight(Board.createFromJSON(actionMessage.board));

        const delegator = new Delegator(knight);
        delegator.notification.subscribe(message => ctx.postMessage(message));
        delegator.start(actionMessage.maxThreadCount);
    }
});

ctx.addEventListener('error', error => {
    const errorMessage: ISearchErrorMessage = {
        tag: tag,
        type: Notifications.SearchError,
        message: error.message
    };
    
    ctx.postMessage(errorMessage);
});
