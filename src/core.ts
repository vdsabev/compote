import * as m from 'mithril';
export const Mithril = m;

export interface App extends Renderable {
  update(...args: any[]): void;
}

export abstract class Component<DataType extends Renderable> implements Renderable {
  constructor(private app: App, data: Partial<DataType>, ...args: any[]) {
    this.app = app;
    Object.assign(this, data);
  }

  update() {
    this.app.update();
  }

  abstract render(...args: any[]): Mithril.Children;
}

export interface Renderable {
  render(...args: any[]): Mithril.Children;
}

export type CustomProperties = {
  key?: number | string;

  oninit?(node?: ComponentNode): void;
  oncreate?(node?: ComponentNode): void;

  onbeforeupdate?(newNode?: ComponentNode, oldNode?: ComponentNode): void | boolean;
  onupdate?(node?: ComponentNode): void;

  onbeforeremove?(node?: ComponentNode): void | Promise<any>;
  onremove?(node?: ComponentNode): void;
};

export type ComponentNode = Mithril.VirtualElement & { dom: HTMLElement };
