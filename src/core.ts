module compote.core {
  /** Renderer */
  type VirtualTree = {
    tagName: string
    attributes: Record<string, string>
    children: (string | VirtualTree)[]
  };

  export class Renderer {
    static document: Document;

    static regex = new RegExp(`
      <\\s*   (\\w+)   (?:\\s+((?:\\w+="\\w+(?:\\.\\w+)*(?:\\((?:\\w+(?:,\\w+)*)*\\))?"   \\s*)+))*>   ([^<>]+)*   <\\/\\1>
    `.replace(/\s+/g, ''));

    static parseTemplate(template: string): VirtualTree {
      const matches = template.match(this.regex) || [];

      const tagName = matches[1];
      if (!tagName) throw new Error(`Invalid tagName: ${tagName} in template: ${template}`);

      const attributes: { [key: string]: string } = {};
      const stringAttributes = matches[2];
      if (stringAttributes) {
        stringAttributes.split(/\s+/).forEach((attribute) => {
          const [key, value] = attribute.split('=');
          attributes[key] = value.slice(1, -1);
        });
      }

      return {
        tagName,
        attributes,
        children: matches[3] ? [matches[3]] : []
      };
    }
  }

  /** Component */
  export class Component {
    static $cache: Record<string, typeof Component> = {};

    $el: HTMLElement;
    private $tree: VirtualTree;

    $initialized: boolean;

    constructor(data?: Partial<Component>) {
      if (data) {
        Object.assign(this, data);
      }

      this.$tree = Renderer.parseTemplate(this.$render());

      const ComponentClass = Component.$cache[this.$tree.tagName];
      if (ComponentClass) {
        this.$el = new ComponentClass(this.$tree.attributes).$el; // TODO: Clean up on `$destroy`
      }
      else {
        this.$el = Renderer.document.createElement(this.$tree.tagName);
        this.$createElement();
      }

      this.$initialized = true;
    }

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    private $empty(container: HTMLElement) {
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
    }

    $mount(container: HTMLElement) {
      this.$empty(container);
      container.appendChild(this.$el);
    }

    $render(): string {
      return `<div></div>`;
    }

    private $createElement() {
      Object.assign(this.$el, this.$tree.attributes); // TODO: Only assign diff

      this.$empty(this.$el);
      this.$tree.children.forEach((child) => {
        if (typeof child === 'string') {
          this.$el.appendChild(Renderer.document.createTextNode(child));
        }
        else {
          // TODO
          // Renderer.document.createElement(child.tagName)
        }
      });
    }

    $update() {
      this.$tree = Renderer.parseTemplate(this.$render());
      this.$createElement();
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
