import { IActionMessage } from "../../common/interfaces/messages/actions/action-message.interface";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { ISearchErrorMessage } from "../../common/interfaces/messages/notifications/search-error.interface";

import { Actions } from "../../common/enums/actions.enum";
import { Notifications } from "../../common/enums/notifications.enum";

import { Board } from "../../common/entities/board.class";
import { Knight } from "../../common/entities/knight.class";
import { SearchWorkersWrapper } from './entities/search-workers-wrapper.class';
import { ISearchStoppedMessage } from "../../common/interfaces/messages/notifications/search-stopped.interface";
import { ISearchStartedMessage } from "../../common/interfaces/messages/notifications/search-started.interface";

const ctx: Worker = self as any;

/**
 * tag of the worker
 */
let tag: string;

/**
 * wrapper of the search workers
 */
const searchWorkersWrapper = new SearchWorkersWrapper();

searchWorkersWrapper.notification.subscribe(message => {
    ctx.postMessage(message);
});

searchWorkersWrapper.searchStops.subscribe(ev => {
    const { countOfMoves } = ev;
    const message: ISearchStoppedMessage = {
        tag,
        countOfMoves,
        type: Notifications.SearchStopped
    };

    ctx.postMessage(message);
});

ctx.addEventListener('message', message => {
    const messageData = message.data as IActionMessage;

    tag = messageData.tag;

    if (messageData.type === Actions.SearchStart) {
        const actionMessage = messageData as IStartSearchMessage;

        if (searchWorkersWrapper.progress)
            throw new Error('Cannot start searching as the search is already in progress.');
        
        if (!actionMessage.board)
            throw new Error('Cannot start searching as the board is not specified.');

        if (typeof actionMessage.maxThreadCount !== 'number')
            throw new Error('Cannot start searching as max count of threads is not specified.');

        if (actionMessage.maxThreadCount < 1)
            throw new Error('Cannot start searching as max count of threads is less than one.');

        const knight = new Knight(Board.createFromJSON(actionMessage.board));
        searchWorkersWrapper.setKnight(knight);
        searchWorkersWrapper.start(actionMessage.maxThreadCount);

        const message: ISearchStartedMessage = {
            tag,
            type: Notifications.SearchStarted
        };

        ctx.postMessage(message);
    }

    if (messageData.type === Actions.SearchStop) {
        if (!searchWorkersWrapper.progress)
            throw new Error('Cannot stop searching as the search has not been started yet.');

        searchWorkersWrapper.stop();
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
