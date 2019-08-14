import SearchWorker from 'worker-loader!./search';

import { IActionMessage } from "../../common/interfaces/messages/actions/action-message.interface";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { ISearchErrorMessage } from "../../common/interfaces/messages/notifications/search-error.interface";

import { Actions } from "../../common/enums/actions.enum";
import { Notifications } from "../../common/enums/notifications.enum";

import { Board } from "../../common/entities/board.class";
import { Knight } from "../../common/entities/knight.class";
import { NotificationsHandler } from './entities/notifications-handler.class';

const ctx: Worker = self as any;

let tag: string;

ctx.addEventListener('message', message => {
    const messageData = message.data as IActionMessage;

    tag = messageData.tag;

    if (messageData.type === Actions.SearchStart) {
        const actionMessage = messageData as IStartSearchMessage;

        const knight = new Knight(Board.createFromJSON(actionMessage.board));

        let depth = 0;
        let maxBoardsFound = 0;

        let boards: Board[] = [];

        do {
            depth++;

            boards = knight.findAllMovesCombinations(depth);

            if (boards.length === maxBoardsFound)
                break;
            
            if (boards.length > maxBoardsFound) {
                maxBoardsFound = boards.length;
            }
        } while(boards.length < actionMessage.maxThreadCount);

        console.log(boards.length);

        const notificationsHandler = new NotificationsHandler();
        notificationsHandler.generalNotification.subscribe(message => ctx.postMessage(message));
        notificationsHandler.searchStopNotification.subscribe(message => {
            if (boards.length > 0) {
                const board = boards.pop();
                if (board) {
                    const index = +message.tag - 1;
                    const startMessage: IStartSearchMessage = {
                        tag: `${index + 1}`,
                        type: Actions.SearchStart,
                        board: board.asJSON(),
                        maxThreadCount: null
                    };
                    searchWorkers[index].postMessage(startMessage);
                }
            }
            
        });

        const searchWorkers: SearchWorker[] = [];
        for (let i = 0;  i < actionMessage.maxThreadCount && i < boards.length; i++) {
            const searchWorker = new SearchWorker();
            searchWorker.addEventListener('message', ev => notificationsHandler.handle(ev.data));
            searchWorkers.push(searchWorker);
        }

        searchWorkers.forEach((worker, index) => {
            const startMessage: IStartSearchMessage = {
                tag: `${index + 1}`,
                type: Actions.SearchStart,
                board: boards[index].asJSON(),
                maxThreadCount: null
            };
            worker.postMessage(startMessage);
        });

        boards.splice(0, searchWorkers.length);
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
