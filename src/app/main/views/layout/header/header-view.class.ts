import { DotHelper } from "../../../helpers/dot-helper.class";
import { TemplatesMarkups } from "../../../constants/templates-markups.class";
import { View } from "../../view.class";
import { HeaderViewData } from "./header-view-data.interface";
import { EventHelper } from "../../../helpers/event-helper.class";

export class HeaderView extends View {
    data: HeaderViewData = {
        title: 'Knight Tour'
    };

    constructor() {
        super();

        this.initTemplate();
        this.attachEvents();
    }

    render(): string {
        return this.dotTemplate(this.data);
    }

    private initTemplate() {
        this.dotTemplate = DotHelper.template(TemplatesMarkups.header);
    }

    private attachEvents() {
        EventHelper.attachEvent('click', '.btn').subscribe(ev => console.log(ev));
    }

    private dotTemplate: (data: object) => string;
}
