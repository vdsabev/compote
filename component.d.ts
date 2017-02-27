/// <reference types="mithril" />
export interface App extends Renderable {
    update(...args: any[]): void;
}
export declare abstract class Component<DataType extends Renderable> implements Renderable {
    private app;
    constructor(app: App, data: Partial<DataType>);
    update(): void;
    abstract render(...args: any[]): Mithril.Children;
}
export interface Renderable {
    render(...args: any[]): Mithril.Children;
}
