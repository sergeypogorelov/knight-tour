import BruteForceWorker from 'worker-loader!./workers/brute-force';

import { INotificationMessage } from './common/interfaces/messages/notifications/notification-message.interface';
import { IStartSearchMessage } from './common/interfaces/messages/actions/start-search-message.interface';
import { Actions } from './common/enums/actions.enum';
import { Board } from './common/entities/board.class';
import { BoardLetters } from './common/enums/board-letters.enum';
import { Knight } from './common/entities/knight.class';

/**
 * represents the application
 */
export class App {
    /**
     * returns the main instance of the app
     */
    static get instance(): App {
        if (App._instance === null) {
            App._instance = new App();
        }

        return App._instance;
    }

    /**
     * runs the app
     */
    run() {
        const worker = new BruteForceWorker();
        worker.addEventListener('message', ev => {
            const notificationMessage = ev.data as INotificationMessage;
            console.log(notificationMessage);
        });
        
        const board = Board.createFromCells(Board.generateUntouchedCells());
        const knight = new Knight(board);
        knight.setStartingPosition({ letter: BoardLetters.A, number: 2 });
        
        console.log(knight.findAllAvailableMoves({ row: 0, column: 0 }));
        console.log(knight.findLastMove());

        const actionMessage: IStartSearchMessage = {
            action: Actions.SearchStart,
            board: board.asJSON()
        };
        worker.postMessage(actionMessage);
    }

    /**
     * the app instance
     */
    private static _instance: App = null;

    private constructor() { }
}
