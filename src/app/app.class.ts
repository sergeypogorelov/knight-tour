import BruteForceWorker from 'worker-loader!./workers/brute-force';

import { INotificationMessage } from './interfaces/messages/notifications/notification-message.interface';
import { IStartSearchMessage } from './interfaces/messages/actions/start-search-message.interface';
import { Actions } from './enums/actions.enum';

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
        
        const actionMessage: IStartSearchMessage = {
            action: Actions.SearchStart,
            board: {
                cells: []
            }
        };
        worker.postMessage(actionMessage);
    }

    /**
     * the app instance
     */
    private static _instance: App = null;

    private constructor() { }
}
