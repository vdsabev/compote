module compote.core {
  /** Renderer */
  export type Renderer = Partial<typeof VirtualDOM>;

  let renderer: Renderer;

  class HTML {
    br: typeof Compote.Component = renderer.h.bind(this, 'br');
    div: typeof Compote.Component = renderer.h.bind(this, 'div');
    span: typeof Compote.Component = renderer.h.bind(this, 'span');
  }

  export let html: Partial<HTML> = {};

  export function setRenderer(bootstrapRenderer: Renderer) {
    renderer = bootstrapRenderer;
    Object.assign(html, new HTML());
  }

  /** Component */
  export interface Component {
    $initialized: boolean;
    $parent: Component;

    $mount?(this: Component): void;
  }

  export abstract class Component {
    constructor(data?: Partial<Component>) {
      Object.assign(this, data);
      this.$initialized = true;
    }

    $update() {
      this.$parent.$update();
    }
  }

  /** Watch */
  export function watch(target: Component, key: string) {
    const privateKey = `$$${key}`;
    Object.defineProperty(target, key, {
      get() {
        return this[privateKey];
      },
      set(this: Component, value: any) {
        (<any>this)[privateKey] = value;
        if (this.$initialized) {
          this.$update();
        }
      }
    });
  }
}
