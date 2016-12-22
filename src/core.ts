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
    $mount?(this: Component): void;
  }

  export abstract class Component {
    $el: Element;
    private $node: VirtualDOM.VNode;
    private $rendered: boolean;

    constructor(data?: Partial<Component>) {
      Object.assign(this, data);

      this.$node = this.$render();
      this.$rendered = true;
      this.$el = renderer.create(this.$node);

      if (this.$mount) {
        this.$mount();
      }
    }

    abstract $render(): VirtualDOM.VNode;

    $update() {
      const diff = renderer.diff(this.$node, this.$render());
      this.$el = renderer.patch(this.$el, diff);
    }
  }

  /** Watch */
  export function watch(target: Component, key: string) {
    const privateKey = `$$${key}`;
    Object.defineProperty(target, key, {
      get() {
        return this[privateKey];
      },
      set(value: any) {
        this[privateKey] = value;
        if (this.$rendered) {
          (<Component>this).$update();
        }
      }
    });
  }
}
