const LAYOUT_MARKUP = require('../views/layout/layout.dot').default;
const HEADER_MARKUP = require('../views/layout/header/header.dot').default;

/**
 * contains doT markup of the templates
 */
export class TemplatesMarkups {
    static readonly layout: string = LAYOUT_MARKUP;

    static readonly header: string = HEADER_MARKUP;

    private constructor() {}
}
