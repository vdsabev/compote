module compote.core {
  /** Renderer */
  type RendererTree = {
    tagName: string
    attributes: { [key: string]: string }
    content: string
  };

  export class Renderer {
    static regex = /<\s*(\w+)(?:\s+((?:\w+="\w+(?:\.\w+)*(?:\((?:\w+(?:,\w+)*)*\))?"\s*)+))*>([^<>]+)*</;

    static parseTemplate(template: string): any {
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
        content: matches[3] || ''
      };
    }
  }

  /** Component */
  type ComponentOptions = {
    id: string
  };

  export class Component {
    static $cache: Record<string, typeof Component> = {};
    static $options: ComponentOptions;

    $el: HTMLElement;
    $tree: RendererTree;

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
        this.$el = document.createElement(this.$tree.tagName);
        Object.assign(this.$el, this.$tree.attributes);
        this.$el.textContent = this.$tree.content;
      }

      this.$initialized = true;
    }

    $render(): string {
      return `<div></div>`;
    }

    $update() {
      this.$tree = Renderer.parseTemplate(this.$render());
      Object.assign(this.$el, this.$tree.attributes); // TODO: Only assign diff
      this.$el.textContent = this.$tree.content;
    }
  }

  /** Decorators */
  export function component(options: any) {
    return (target: typeof Component) => {
      Component.$cache[options.id] = target;
      target.$options = options;
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
