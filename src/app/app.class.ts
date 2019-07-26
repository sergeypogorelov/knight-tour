import { Templates } from "./constants/templates.class";
import { DotHelper } from "./helpers/dot.helper";

import * as workerPath from "file-loader?name=[name].[hash].js!./workers/test.worker";

/**
 * represents the application
 */
export class App {
    /**
     * returns the main instance of the app
     */
    static get mainInstance(): App {
        if (App.instance === null) {
            App.instance = new App();
        }

        return App.instance;
    }

    /**
     * the app instance
     */
    private static instance: App = null;

    /**
     * runs the app
     */
    run() {
        const testTemplateMarkup = Templates.test;
        const testTemplate = DotHelper.template(testTemplateMarkup);
        const htmlString = testTemplate({ name: 'Vasya' });

        console.log(htmlString);

        const worker = new Worker(workerPath);

        console.log(workerPath, worker);
        worker.addEventListener('message', message => {
            console.log(message);
        });
        worker.postMessage('this is a test message to the worker');
    }
}
