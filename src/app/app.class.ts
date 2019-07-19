import { TemplatesContent } from "./constants/templates-content.class";
import { DotHelper } from "./helpers/dot.helper";

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
        const testTemplateMarkup = TemplatesContent.test;
        const testTemplate = DotHelper.template(testTemplateMarkup);
        const htmlString = testTemplate({ name: 'Vasya' });

        console.log(htmlString);
    }
}
