import { Renderable } from "../interfaces/renderable.interface";

export abstract class View implements Renderable {
    abstract render(): string;
}
