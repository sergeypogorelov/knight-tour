import BruteForceWorker from 'worker-loader!./workers/brute-force';

import { IStartSearchMessage } from './common/interfaces/messages/actions/start-search-message.interface';

import { Actions } from './common/enums/actions.enum';
import { BoardLetters } from './common/enums/board-letters.enum';

import { EventHelper } from './main/helpers/event-helper.class';

import { Board } from './common/entities/board.class';
import { Knight } from './common/entities/knight.class';

import { LayoutView } from './main/views/layout/layout-view.class';

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
        const layoutView = new LayoutView('root');
        layoutView.mount();
        layoutView.mountChildViews();
    }

    /**
     * the app instance
     */
    private static _instance: App = null;

    private constructor() { }
}
