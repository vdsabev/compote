module compote.core {
  type VirtualTree = {
    tagName: string
    attributes: Record<string, string>
    children: (string | VirtualTree)[]
  };

  /** Parser */
  export class Parser {
    static tagNameRegex = `(\\w+)`;
    static attributeKeyRegex = `\\w+`;
    static attributeValueRegex = `\\w+(?:\\.\\w+)*(?:\\((?:\\w+(?:,\\w+)*)*\\))?`;
    static attributesRegex = `((?: ${Parser.attributeKeyRegex} = "${Parser.attributeValueRegex}" \\s*)+)`;
    static childrenRegex = `(.+)*`;

    static regex = new RegExp(`^\\s*
      <\\s* ${Parser.tagNameRegex} (?:\\s+ ${Parser.attributesRegex})*>
        ${Parser.childrenRegex}
      <\\/\\1>
    \\s*$`.replace(/\s+/g, ''));

    static parseTemplate(template: string): VirtualTree {
      const matches = template.match(this.regex) || [];

      if (!matches.length) {
        return <any>template;
      }

      const tagName = matches[1];
      if (!tagName) throw new Error(`Invalid tagName: ${tagName} in template: ${template}`);

      const attributes: Record<string, string> = {};
      const stringAttributes = matches[2];
      if (stringAttributes) {
        stringAttributes.split(/\s+/).forEach((attribute) => {
          const [key, value] = attribute.split('=');
          attributes[key] = value.slice(1, -1);
        });
      }

      const children = [];
      const stringChildren = matches[3];
      if (stringChildren) {
        children.push(Renderer.parseTemplate(stringChildren));
      }

      return {
        tagName,
        attributes,
        children
      };
    }
  }

  /** Renderer */
  export class Renderer {
    static document: Document;

    static regex = new RegExp(`
      <\\s*   (\\w+)   (?:\\s+((?:\\w+="\\w+(?:\\.\\w+)*(?:\\((?:\\w+(?:,\\w+)*)*\\))?"   \\s*)+))*>   (.+)*   <\\/\\1>
    `.replace(/\s+/g, ''));

    static parseTemplate(template: string): VirtualTree {
      const matches = template.match(this.regex) || [];

      if (!matches.length) {
        return <any>template;
      }

      const tagName = matches[1];
      if (!tagName) throw new Error(`Invalid tagName: ${tagName} in template: ${template}`);

      const attributes: Record<string, string> = {};
      const stringAttributes = matches[2];
      if (stringAttributes) {
        stringAttributes.split(/\s+/).forEach((attribute) => {
          const [key, value] = attribute.split('=');
          attributes[key] = value.slice(1, -1);
        });
      }

      const children = [];
      const stringChildren = matches[3];
      if (stringChildren) {
        children.push(Renderer.parseTemplate(stringChildren));
      }

      return {
        tagName,
        attributes,
        children
      };
    }

    // TODO: Only update changed attributes
    static updateAttributes($el: HTMLElement, attributes: Record<string, string>) {
      Object.assign($el, attributes);
    }

    // TODO: Only update changed children
    static updateChildren($el: HTMLElement, children: (string | VirtualTree)[]) {
      Renderer.removeAllChildren($el);
      children.forEach((child) => {
        if (typeof child === 'string') {
          $el.appendChild(Renderer.document.createTextNode(child));
        }
        else {
          $el.appendChild(Renderer.document.createElement(child.tagName));
        }
      });
    }

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    static removeAllChildren($el: HTMLElement) {
      while ($el.firstChild) {
        $el.removeChild($el.lastChild);
      }
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
        Renderer.updateAttributes(this.$el, this.$tree.attributes);
        Renderer.updateChildren(this.$el, this.$tree.children);
      }

      this.$initialized = true;
    }

    $mount(container: HTMLElement) {
      Renderer.removeAllChildren(container);
      container.appendChild(this.$el);
    }

    $render(): string {
      return `<div></div>`;
    }

    $update() {
      this.$tree = Renderer.parseTemplate(this.$render());
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
