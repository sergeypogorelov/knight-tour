import { Model } from "../../interfaces/model.interface";
import { LayoutModelData } from "./layout-model-data.interface";
import { HeaderModel } from "./header/header.model";
import { DotHelper } from "../../helpers/dot-helper.class";
import { TemplatesMarkups } from "../../constants/templates-markups.class";

export class LayoutModel implements Model<LayoutModelData> {
    data: LayoutModelData;

    get id(): string {
        return this._id;
    }

    get headerId(): string {
        return this._headerId;
    }

    get parentId(): string {
        return this._parentId;
    }

    get headerModel(): HeaderModel {
        return this._headerModel;
    }

    constructor(parentId: string) {
        this._parentId = parentId;

        this._headerModel = new HeaderModel(this.headerId);
    }

    mount() {
        document.getElementById(this.parentId).innerHTML = DotHelper.template(TemplatesMarkups.layout)(this.data);
        
        this.headerModel.mount();
    }

    render() {

    }

    unmount() {

    }

    private _id: string  = 'model-layout';

    private _headerId: string = 'layout-header';

    private _parentId: string;

    private _headerModel: HeaderModel;
}
