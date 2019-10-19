import { Model } from "../../../interfaces/model.interface";
import { HeaderModelData } from "./header-model-data.interface";

import { DotHelper } from "../../../helpers/dot-helper.class";
import { TemplatesMarkups } from "../../../constants/templates-markups.class";

export class HeaderModel implements Model<HeaderModelData> {
    data: HeaderModelData;

    get id(): string {
        return this._id;
    }

    get parentId(): string {
        return this._parentId;
    }

    constructor(parentId: string) {
        this._parentId = parentId;
    }

    mount() {
        document.getElementById(this.parentId).innerHTML = DotHelper.template(TemplatesMarkups.header)(this.data);
    }

    render() {
        
    }

    unmount() {
        
    }

    private _id: string  = 'model-layout-header';

    private _parentId: string;
}
