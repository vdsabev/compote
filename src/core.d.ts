/// <reference types="mithril" />
export declare const Mithril: Mithril.Static;
export interface App extends Renderable {
    update(...args: any[]): void;
}
export declare abstract class Component<DataType extends Renderable> implements Renderable {
    private app;
    constructor(app: App, data: Partial<DataType>, ...args: any[]);
    update(): void;
    abstract render(...args: any[]): Mithril.Children;
}
export interface Renderable {
    render(...args: any[]): Mithril.Children;
}
export declare type CustomProperties = {
    key?: number | string;
    oninit?(node?: ComponentNode): void;
    oncreate?(node?: ComponentNode): void;
    onbeforeupdate?(newNode?: ComponentNode, oldNode?: ComponentNode): void | boolean;
    onupdate?(node?: ComponentNode): void;
    onbeforeremove?(node?: ComponentNode): void | Promise<any>;
    onremove?(node?: ComponentNode): void;
};
export declare type ComponentNode = Mithril.VirtualElement & {
    dom: HTMLElement;
};
