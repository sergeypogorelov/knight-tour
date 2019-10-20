import { DotHelper } from "../../../helpers/dot-helper.class";
import { TemplatesMarkups } from "../../../constants/templates-markups.class";
import { View } from "../../view.class";
import { HeaderViewData } from "./header-view-data.interface";

export class HeaderView extends View {
    data: HeaderViewData = {
        title: 'Knight Tour'
    };

    constructor() {
        super();

        this.dotTemplate = DotHelper.template(TemplatesMarkups.header);
    }

    render(): string {
        return this.dotTemplate(this.data);
    }

    dotTemplate: (data: object) => string;
}
