export interface Model<T> {
    id: string;
    parentId: string;

    data: T;

    mount(): void;
    render(): void;
    unmount(): void;
}
