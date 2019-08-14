import BruteForceWorker from 'worker-loader!./workers/brute-force';

import { IStartSearchMessage } from './common/interfaces/messages/actions/start-search-message.interface';

import { Actions } from './common/enums/actions.enum';
import { BoardLetters } from './common/enums/board-letters.enum';

import { Board } from './common/entities/board.class';
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
        const board = Board.createFromCells(Board.generateUntouchedCells(5, 5));
        const knight = new Knight(board);

        knight.setStartingPosition(board.castCoordinateFromBoardToMatrix({ letter: BoardLetters.D, number: 2 }));

        const worker = new BruteForceWorker();
        worker.addEventListener('message', message => console.log(message.data));
        worker.addEventListener('error', error => console.error(error));

        const message: IStartSearchMessage = {
            tag: 'main-worker',
            type: Actions.SearchStart,
            board: board.asJSON(),
            maxThreadCount: 4
        };

        worker.postMessage(message);
    }

    /**
     * the app instance
     */
    private static _instance: App = null;

    private constructor() { }
}
