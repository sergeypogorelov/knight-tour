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
        
    }

    /**
     * the app instance
     */
    private static _instance: App = null;

    private constructor() { }
}
