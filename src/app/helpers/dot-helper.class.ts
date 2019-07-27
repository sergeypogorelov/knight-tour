const dot = require('dot');

/**
 * helper to work with doT.js
 */
export class DotHelper {

    /**
     * Compiles the specified markup into template
     * 
     * @param markup doT.js markup to compile
     */
    static template(markup: string): (data: object) => string {
        if (!markup)
            throw new Error('Markup is not specified.');

        return dot.template(markup);
    }

}
