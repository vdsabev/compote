module compote.core {
  /** Caches */
  const componentInstancesCache: Record<string, Component> = {};

  /** Parser */
  export class Parser {
    static tagEndRegex = /[\.\(]/;

    // TODO: Interpolate more than 1 expression in a string
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = '(\\w+)\\.(\\w+)';
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static textNodeStartString = '> ';

    static parseTagName(definition: string) {
      return (definition.split(Parser.tagEndRegex)[0] || '').trim();
    }

    static parseClassNames(definition: string): string[] {
      const classNamesStartIndex = definition.indexOf('.');
      if (classNamesStartIndex === -1) return [];

      const classNamesEndIndex = definition.indexOf('(');
      if (classNamesEndIndex === -1) return definition.substring(classNamesStartIndex + 1).split('.');

      if (classNamesEndIndex < classNamesStartIndex) return [];

      return definition.substring(classNamesStartIndex + 1, classNamesEndIndex).split('.');
    }

    static parseAttributes(definition: string): ComponentAttributes {
      const attributes: ComponentAttributes = {};

      const attributesStartIndex = definition.indexOf('(');
      const attributesEndIndex = definition.indexOf(')', attributesStartIndex + 1);
      if ((attributesStartIndex === -1) !== (attributesEndIndex === -1)) throw new Error(`Missing parentheses in attributes definition: ${definition}`);

      if (attributesStartIndex !== -1 && attributesEndIndex !== -1) {
        const attributesString = definition.substring(attributesStartIndex + 1, attributesEndIndex);
        if (attributesString) {
          definition = definition.substring(0, attributesStartIndex);

          let attributeMatches: RegExpExecArray;
          const attributesRegex = /(?:\s*(\w+="[^"]+")\s*)+/g;
          while (attributeMatches = attributesRegex.exec(attributesString)) {
            const [key, value] = attributeMatches[1].split('=');
            attributes[key] = value.slice(1, -1);
          }
        }
      }

      return attributes;
    }
  }

  /** Renderer */
  export class Renderer {
    static delay: (fn: Function) => void;
    static document: Document;
  }

  /** Component */
  type ComponentElement = HTMLElement | Text;

  type ComponentAttributes = Record<string, string>;

  export type ComponentTree = [
    string,
    ComponentData<Component>,
    ComponentChild[]
  ];

  export type ComponentData<DataType> = Partial<DataType>;

  type ComponentChild = string | Component;

  export interface Component {
    $onInit?(): void;
    $onDestroy?(): void;
  }

  export class Component {
    $id = uniqueId('_');
    $el: ComponentElement;
    $rendering: boolean;
    $initializing: boolean;

    private $tagName: string;
    private $classNames: string[] = [];
    private $attributes: ComponentAttributes = {};
    private $data: ComponentData<Component>;
    private $children: ComponentChild[];

    constructor(
      private $constructorDefinition?: string,
      private $constructorData?: ComponentData<Component>,
      private $constructorChildren?: ComponentChild[]
    ) {
      componentInstancesCache[this.$id] = this;

      this.$initializing = true;
      Renderer.delay(() => this.$init());
    }

    $mountTo($container: HTMLElement, removeAllChildren = true) {
      if (this.$initializing) {
        Renderer.delay(() => this.$mountTo($container, removeAllChildren));
        return;
      }

      if (removeAllChildren) {
        this.$removeAllChildren($container);
      }

      $container.appendChild(this.$el);
    }

    $appendTo($container: HTMLElement) {
      this.$mountTo($container, false);
    }

    $render(): ComponentTree {
      return [this.$constructorDefinition, this.$constructorData, this.$constructorChildren];
    }

    $update() {
      if (this.$initializing) {
        Renderer.delay(() => this.$update());
        return;
      }

      if (this.$el.nodeType === Node.ELEMENT_NODE) {
        this.$updateAttributeExpressions(<HTMLElement>this.$el, this.$attributes);
        this.$updateChildren(this.$children);
      }
      else if (this.$el.nodeType === Node.TEXT_NODE) {
        const expression = this.$el.textContent;
        const matches = expression && expression.match(Parser.expressionRegex);
        if (matches && matches.length > 0) {
          this.$el.textContent = this.$parseExpression(expression, matches[1], matches[2]);
        }
      }
    }

    $destroy() {
      if (this.$onDestroy) {
        this.$onDestroy();
      }

      this.$el.parentNode.removeChild(this.$el);
      delete componentInstancesCache[this.$id];
    }

    private $init() {
      this.$rendering = true;
      const tree = this.$render();
      this.$rendering = false;

      const [definition] = tree;
      if (definition.startsWith(Parser.textNodeStartString)) {
        this.$el = Renderer.document.createTextNode(definition.substring(Parser.textNodeStartString.length));
      }
      else {
        this.$parseTree(tree);
        this.$setData(this.$data);

        this.$el = Renderer.document.createElement(this.$tagName);
        if (this.$classNames.length > 0) {
          this.$el.className = this.$classNames.join(' ');
        }

        // Attributes
        this.$setAttributes(this.$el, this.$attributes);
        this.$updateAttributeExpressions(this.$el, this.$attributes);

        // Children
        this.$setChildren(this.$el, this.$children);
        this.$updateChildren(this.$children);
      }

      if (this.$onInit) {
        this.$onInit();
      }

      this.$initializing = false;
    }

    private $parseTree([definition, data, children]: ComponentTree) {
      if (definition) {
        this.$tagName = Parser.parseTagName(definition);
        this.$classNames = Parser.parseClassNames(definition);
        this.$attributes = Parser.parseAttributes(definition);
      }

      if (!this.$tagName) {
        this.$tagName = 'div';
      }

      this.$data = data;

      this.$children = children;
    }

    // TODO: Deep copy instead of shallow to prevent overriding the original object
    private $setData(data: Partial<Component>) {
      Object.assign(this, data);
    }

    // TODO: Only update changed expressions
    private $setAttributes($el: HTMLElement, attributes: ComponentAttributes) {
      for (let key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          $el.setAttribute(key, attributes[key]);
        }
      }
    }

    private $updateAttributeExpressions($el: HTMLElement, attributes: ComponentAttributes) {
      for (let key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          const expression = $el.getAttribute(key);
          const matches = expression && expression.match(Parser.expressionRegex);
          if (matches && matches.length > 0) {
            $el.setAttribute(key, this.$parseExpression(expression, matches[1], matches[2]));
          }
        }
      }
    }

    private $parseExpression(expression: string, componentId: string, componentKey: string) {
      const value = (<any>componentInstancesCache[componentId])[componentKey];
      return expression.replace(Parser.expressionRegex, value != null ? value : '');
    }

    private $setChildren($el: HTMLElement, children: ComponentChild[]) {
      children.forEach((child, index) => {
        if (typeof child === 'string') {
          const childComponent = children[index] = $(Parser.textNodeStartString + child);
          childComponent.$appendTo($el);
        }
        else {
          child.$appendTo($el);
        }
      });
    }

    private $updateChildren(children: ComponentChild[]) {
      children.forEach((child: Component) => child.$update());
    }

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    private $removeAllChildren($el: ComponentElement) {
      while ($el.firstChild) {
        $el.removeChild($el.lastChild);
      }
    }
  }

  export function $(definition = 'div', data: ComponentData<Component> = {}, children: ComponentChild[] = []): Component {
    return new Component(definition, data, children);
  }

  /** Decorators */
  export function bind(target: Component, key: string) {
    const privateKey = `$$${key}`;
    Object.defineProperty(target, key, {
      get(this: Component) {
        if (this.$rendering) {
          const expression = `${this.$id}.${key}`;
          return Parser.expressionStartString + expression + Parser.expressionEndString;
        }
        return (<any>this)[privateKey];
      },
      set(this: Component, value: any) {
        (<any>this)[privateKey] = value;
        this.$update();
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
