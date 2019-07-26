import { Templates } from "./constants/templates.class";
import { DotHelper } from "./helpers/dot.helper";

import { Test } from './interfaces/messages/test.interface';

import * as workerPath from "file-loader?name=[name].[hash].js!./workers/test.worker";

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
        const testTemplateMarkup = Templates.test;
        const testTemplate = DotHelper.template(testTemplateMarkup);
        const htmlString = testTemplate({ name: 'Vasya' });

        console.log(htmlString);

        const worker = new Worker(workerPath);

        worker.addEventListener('message', message => {
            console.log('main thread: ', message);
        });
        const message: Test = { message: 'hello' };
        worker.postMessage(message);
    }

    /**
     * the app instance
     */
    private static _instance: App = null;
}
