import { View } from "./view.class";

import { Renderable } from "../interfaces/renderable.interface";
import { Mountable } from "../interfaces/mountable.interface";

export abstract class ViewContainer implements Renderable, Mountable {
    get parentId(): string {
        return this._parentId;
    }

    constructor(parentId: string) {
        this._parentId = parentId;
    }

    getViewById(id: string): View {
        return this._containerIdsToViews[id] || null;
    }

    mount() {
        const parentEl = document.getElementById(this.parentId);
        
        if (!parentEl)
            throw new Error('Parent element has not been found.');

        parentEl.innerHTML = this.render();
    }

    mountChildViews() {
        for (let containerId in this._containerIdsToViews) {
            this.mountChildView(containerId);
        }
    }

    mountChildView(containerId: string) {
        const view = this.getViewById(containerId);

        if (!view)
            throw new Error('View is not specified.');

        const containerEl = document.getElementById(containerId);

        if (!containerEl)
            throw new Error('Container element is not specified.');

        containerEl.innerHTML = view.render();
    }

    abstract render(): string;

    unmount() {
        const parentEl = document.getElementById(this.parentId);

        if (!parentEl)
            throw new Error('Parent element has not been found.');

        parentEl.innerHTML = '';
    }

    unmountChildViews() {
        for (let containerId in this._containerIdsToViews) {
            this.unmountChildView(containerId);
        }
    }

    unmountChildView(containerId: string) {
        const view = this.getViewById(containerId);

        if (!view)
            throw new Error('View is not specified.');

        const containerEl = document.getElementById(containerId);

        if (!containerEl)
            throw new Error('Container element is not specified.');

        containerEl.innerHTML = '';
    }

    protected _parentId: string;

    protected _containerIdsToViews: { [id: string]: View } = {};
}
