module compote.core {
  export type VirtualTree = {
    tagName: string
    attributes: Record<string, string>
    children: VirtualTreeChild[]
  };

  export type VirtualTreeChild = string | VirtualTree;

  /** Renderer */
  export class Renderer {
    static document: Document;

    // TODO: Only update changed attributes
    static updateAttributes($el: HTMLElement, attributes: Record<string, string>) {
      Object.assign($el, attributes);
    }

    // TODO: Only update changed children
    static updateChildren($el: HTMLElement, children: VirtualTreeChild[]) {
      Renderer.removeAllChildren($el);
      children.forEach((child) => {
        if (typeof child === 'string') {
          $el.appendChild(Renderer.document.createTextNode(child));
        }
        else {
          const ComponentClass = Component.$cache[child.tagName];
          let $childEl: HTMLElement;
          if (ComponentClass) {
            $childEl = new ComponentClass(child.attributes).$el; // TODO: Clean up on `$destroy`
          }
          else {
            $childEl = Renderer.document.createElement(child.tagName);
            Renderer.updateAttributes($childEl, child.attributes);
            Renderer.updateChildren($childEl, child.children);
          }
          $el.appendChild($childEl);
        }
      });
    }

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    static removeAllChildren($el: HTMLElement) {
      while ($el.firstChild) {
        $el.removeChild($el.lastChild);
      }
    }

    static h(tagName: string, attributes: Record<string, string> = {}, children: any[] = []): VirtualTree {
      return { tagName, attributes, children };
    }

    static div = Renderer.h.bind(Renderer, 'div');
    static span = Renderer.h.bind(Renderer, 'span');
    static input = Renderer.h.bind(Renderer, 'input');
  }

  /** Component */
  export class Component {
    static $cache: Record<string, typeof Component> = {};

    private $tree: VirtualTree;
    $el: HTMLElement;
    $initialized: boolean;

    constructor(data?: Partial<Component>) {
      if (data) {
        Object.assign(this, data);
      }

      this.$tree = this.$render();
      this.$el = Renderer.document.createElement(this.$tree.tagName);
      Renderer.updateAttributes(this.$el, this.$tree.attributes);
      Renderer.updateChildren(this.$el, this.$tree.children);

      this.$initialized = true;
    }

    $mount(container: HTMLElement) {
      Renderer.removeAllChildren(container);
      container.appendChild(this.$el);
    }

    $render(): VirtualTree {
      return Renderer.div();
    }

    $update() {
      this.$tree = this.$render();
      Renderer.updateAttributes(this.$el, this.$tree.attributes);
      Renderer.updateChildren(this.$el, this.$tree.children);
    }
  }

  /** Decorators */
  type ComponentOptions = {
    id: string
  };

  export function component(options: ComponentOptions) {
    return (target: typeof Component) => {
      Component.$cache[options.id] = target;
    };
  }

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
