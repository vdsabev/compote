module compote.core {
  export type VirtualTree = {
    tagName: string
    properties: Record<string, any>
    children: VirtualTreeChild[]
  };

  export type VirtualTreeChild = string | VirtualTree;

  /** Caches */
  const componentClassesCache: Record<string, typeof Component> = {}; // TODO: Remove, along with `id` and `@component`
  const componentInstancesCache: Record<string, Component> = {};

  /** Renderer */
  export class Renderer {
    static document: Document;

    // TODO: Interpolate more than 1 expression
    static expressionRegex = /^.*{{(\w+)\.(\w+)}}.*$/; // TODO: Make configurable

    // TODO: Only update changed properties
    static updateProperties($el: HTMLElement, properties: Record<string, any>) {
      Object.assign($el, properties);
    }

    // TODO: Only update changed expressions
    static interpolateExpressions($el: HTMLElement, data: Record<string, any>) {
      const key = 'textContent';
      const expression = (<any>$el)[key];
      const matches = expression && expression.match(Renderer.expressionRegex);
      if (matches && matches.length > 0) {
        const componentId = matches[1];
        const componentKey = matches[2];
        (<any>$el)[key] = expression.replace(/{{(\w+).(\w+)}}/, (<any>componentInstancesCache[componentId])[componentKey]);
      }
    }

    // TODO: Only update changed children
    static updateChildren($el: HTMLElement, children: VirtualTreeChild[]) {
      Renderer.removeAllChildren($el);
      children.forEach((child) => {
        if (typeof child === 'string') {
          $el.appendChild(Renderer.document.createTextNode(child));
        }
        else {
          const ComponentClass = componentClassesCache[child.tagName];
          let $childEl: HTMLElement;
          if (ComponentClass) {
            $childEl = new ComponentClass().$el; // TODO: Clean up on `$destroy`
          }
          else {
            $childEl = Renderer.document.createElement(child.tagName);
            Renderer.updateProperties($childEl, child.properties);
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

    static h(tagName: string, properties: Record<string, any> = {}, children: VirtualTreeChild[] = []): VirtualTree {
      return { tagName, properties, children };
    }

    static div = (properties: Record<string, any> = {}, children: VirtualTreeChild[] = []) => Renderer.h('div', properties, children);
    static span = (properties: Record<string, any> = {}, children: VirtualTreeChild[] = []) => Renderer.h('span', properties, children);
    static input = (properties: Record<string, any> = {}, children: VirtualTreeChild[] = []) => Renderer.h('input', properties, children);
  }

  /** Component */
  export class Component {
    private $tree: VirtualTree;
    $el: HTMLElement;
    $id: string;
    $initialized: boolean;
    $rendering: boolean;

    constructor() {
      this.$id = uniqueId('_');
      componentInstancesCache[this.$id] = this; // TODO: Remove from cache on destroy

      this.$updateTree();
      this.$el = Renderer.document.createElement(this.$tree.tagName);
      this.$updateElement();

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
      this.$updateTree();
      this.$updateElement();
    }

    private $updateTree() {
      this.$rendering = true;
      this.$tree = this.$render();
      this.$rendering = false;
    }

    private $updateElement() {
      Renderer.updateProperties(this.$el, this.$tree.properties);
      Renderer.updateChildren(this.$el, this.$tree.children);
      Renderer.interpolateExpressions(this.$el, this.$getData());
    }

    private $getData(): Record<string, any> {
      const data: Record<string, any> = {};
      for (let key in this) {
        if (this.hasOwnProperty(key) && key.startsWith('$$')) {
          data[key.replace('$$', '')] = this[key];
        }
      }

      return data;
    }
  }

  /** Decorators */
  type ComponentOptions = {
    id: string
  };

  export function component(options: ComponentOptions) {
    return (target: typeof Component) => {
      componentClassesCache[options.id] = target;
    };
  }

  export function bind(target: Component, key: string) {
    const privateKey = `$$${key}`;
    Object.defineProperty(target, key, {
      get(this: Component) {
        if (this.$rendering) {
          return `{{${this.$id}.${key}}}`; // TODO: Make configurable
        }
        return (<any>this)[privateKey];
      },
      set(this: Component, value: any) {
        (<any>this)[privateKey] = value;
        if (this.$initialized) {
          this.$update();
        }
      }
    });
  }

  /** Utils */
  let idCounter = -1;
  function uniqueId(prefix = '') {
    idCounter++;
    return prefix + idCounter.toString();
  }
}
