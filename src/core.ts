module compote.core {
  export class Renderer {
    constructor(private render: typeof VirtualDOM.h) {
    }

    br: typeof Compote.Component = this.render.bind(this, 'br');
    div: typeof Compote.Component = this.render.bind(this, 'div');
    span: typeof Compote.Component = this.render.bind(this, 'span');
  }

  export interface Component {
    update?(this: Component): void;
  }

  export abstract class Component {
    abstract render(): VirtualDOM.VNode;

    constructor(data: Partial<Component>) {
      Object.assign(this, data);
    }
  }
}
