import BruteForceWorker from 'worker-loader!./workers/brute-force';

import { INotificationMessage } from './common/interfaces/messages/notifications/notification-message.interface';
import { IStartSearchMessage } from './common/interfaces/messages/actions/start-search-message.interface';
import { Actions } from './common/enums/actions.enum';
import { Board } from './common/entities/board.class';
import { BoardLetters } from './common/enums/board-letters.enum';
import { Knight } from './common/entities/knight.class';
import { IMatrixCoordinate } from './common/interfaces/matrix-coordinate.interface';

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
        const maxCountOfThreads = 8;

        const boardWidth = 5;
        const boardHeight = 5;
        const board = Board.createFromCells(Board.generateUntouchedCells(boardWidth, boardHeight));
        
        const knightStartingPosition = board.castCoordinateFromBoardToMatrix({ letter: BoardLetters.E, number: 3 });
        const knight = Knight.create(board);

        knight.setStartingPosition(knightStartingPosition);

        console.log(knight.findAllMovesCombinations(2));

        // const worker = new BruteForceWorker();
        // worker.addEventListener('message', ev => {
        //     const notificationMessage = ev.data as INotificationMessage;
        //     console.log(notificationMessage);
        // });
        
        

        // const actionMessage: IStartSearchMessage = {
        //     action: Actions.SearchStart,
        //     board: board.asJSON()
        // };
        // worker.postMessage(actionMessage);
    }

    /**
     * the app instance
     */
    private static _instance: App = null;

    private constructor() { }
}
