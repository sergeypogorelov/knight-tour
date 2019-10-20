import { DotHelper } from "../../helpers/dot-helper.class";
import { TemplatesMarkups } from "../../constants/templates-markups.class";
import { LayoutViewData } from "./layout-view-data.interface";
import { ViewContainer } from "../view-container.class";
import { HeaderView } from "./header/header-view.class";

export class LayoutView extends ViewContainer {
    get headerId(): string {
        return this._headerId;
    }

    get headerView(): HeaderView {
        return this._headerView;
    }

    get data(): LayoutViewData {
        return this._data;
    }

    constructor(parentId: string) {
        super(parentId);

        this.dotTemplate = DotHelper.template(TemplatesMarkups.layout);

        this._headerView = new HeaderView();

        this._containerIdsToViews = {
            [this.headerId]: this._headerView
        };
    }

    render(): string {
        return this.dotTemplate(this.data);
    }

    dotTemplate: (data: object) => string;

    private _headerId: string = 'layout-header';

    private _headerView: HeaderView;

    private _data: LayoutViewData;
}
