module compote.core {
  /** Caches */
  const componentInstancesCache: Record<string, Component> = {};

  /** Parser */
  export class Parser {
    static attributesStartString = '(';
    static attributesEndString = ')';

    // TODO: Interpolate more than 1 expression
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = '(\\w+)\\.(\\w+)';
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static parseAttributes(definition: string): ComponentAttributes {
      const attributes: ComponentAttributes = {};

      // TODO: Make characters customizable
      const attributesStartIndex = definition.indexOf(Parser.attributesStartString);
      const attributesEndIndex = definition.indexOf(Parser.attributesEndString, attributesStartIndex + 1);
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
    static document: Document;

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    static removeAllChildren($el: HTMLElement) {
      while ($el.firstChild) {
        $el.removeChild($el.lastChild);
      }
    }

    static mount(container: HTMLElement, component: Component) {
      Renderer.removeAllChildren(container);
      container.appendChild(component.$el);
    }

    static tag(name: string) {
      return (properties: core.ComponentProperties<never> = {}, children: core.ComponentChild[] = []): Component => {
        return new Component(name, properties, children);
      };
    }

    static div = Renderer.tag('div');
    static span = Renderer.tag('span');
    static input = Renderer.tag('input');
    static textarea = Renderer.tag('textarea');
    static button = Renderer.tag('button');
  }

  /** Component */
  export type ComponentTree = [
    string,
    ComponentProperties<Component>,
    ComponentChild[]
  ];

  export type ComponentAttributes = Record<string, string>;

  export type ComponentProperties<DataType> = Partial<HTMLElement> & {
    [key: string]: any
    data?: Partial<DataType>
  };

  export type ComponentChild = string | Component;

  export interface Component {
    $onInit?(): void;
    $onDestroy?(): void;
  }

  export class Component {
    $id = uniqueId('_');
    $el: HTMLElement;
    $rendered: boolean;
    $initialized: boolean;

    private $tagName: string;
    private $classNames: string[] = [];
    private $attributes: ComponentAttributes = {};
    private $properties: ComponentProperties<Component>;
    private $children: ComponentChild[];

    // TODO: Support text nodes
    constructor(
      private $constructorDefinition?: string,
      private $constructorProperties?: ComponentProperties<Component>,
      private $constructorChildren?: ComponentChild[]
    ) {
      componentInstancesCache[this.$id] = this;

      const [definition, properties, children] = this.$render();
      this.$rendered = true;

      this.$parse(definition);
      this.$properties = properties;
      this.$children = children;

      this.$el = Renderer.document.createElement(this.$tagName);
      this.$el.className = this.$classNames.join(' ');

      // Attributes
      for (let key in this.$attributes) {
        if (this.$attributes.hasOwnProperty(key)) {
          this.$el.setAttribute(key, this.$attributes[key]);
        }
      }
      this.$updateAttributeExpressions();

      // Properties
      this.$updateProperties();
      this.$updatePropertyExpressions();

      // Children
      this.$children.forEach((child) => {
        if (typeof child === 'string') {
          // TODO: Make this a component as well
          const $child = Renderer.document.createTextNode(child);
          this.$el.appendChild($child);
        }
        else {
          this.$el.appendChild(child.$el);
        }
      });
      this.$updateChildExpressions();

      this.$initialized = true;

      if (this.$onInit) {
        this.$onInit();
      }
    }

    $render(): ComponentTree {
      return [this.$constructorDefinition, this.$constructorProperties, this.$constructorChildren];
    }

    private $parse(definition: string) {
      if (!definition) return;

      [this.$tagName, ...this.$classNames] = definition.split(/[\.\1s]+/);
      this.$attributes = Parser.parseAttributes(definition);

      if (!this.$tagName) {
        this.$tagName = 'div';
      }
    }

    $update() {
      // TODO: Implement
    }

    // TODO: Only update changed properties
    private $updateProperties() {
      Object.assign(this.$el, this.$properties);
      Object.assign(this, this.$properties.data);
    }

    // TODO: Only update changed expressions
    private $updatePropertyExpressions() {
      for (let key in this.$properties) {
        if (this.$properties.hasOwnProperty(key)) {
          const expression = (<any>this.$el)[key];
          const matches = expression && expression.match(Parser.expressionRegex);
          if (matches && matches.length > 0) {
            const componentId = matches[1];
            const componentKey = matches[2];
            (<any>this.$el)[key] = expression.replace(Parser.expressionRegex, (<any>componentInstancesCache[componentId])[componentKey]);
          }
        }
      }
    }

    // TODO: Only update changed expressions
    private $updateAttributeExpressions() {
      for (let key in this.$attributes) {
        if (this.$attributes.hasOwnProperty(key)) {
          const expression = this.$el.getAttribute(key);
          const matches = expression && expression.match(Parser.expressionRegex);
          if (matches && matches.length > 0) {
            const componentId = matches[1];
            const componentKey = matches[2];
            this.$el.setAttribute(key, expression.replace(Parser.expressionRegex, (<any>componentInstancesCache[componentId])[componentKey]));
          }
        }
      }
    }

    private $updateChildExpressions() {
      // TODO: Implement
    }

    // TODO: Implement
    // private $destroy() {
    //   if (this.$onDestroy) {
    //     this.$onDestroy();
    //   }
    //
    //   this.$el.parentNode.removeChild(this.$el);
    //   delete componentInstancesCache[this.$id];
    // }
  }

  /** Decorators */
  export function bind(target: Component, key: string) {
    const privateKey = `$$${key}`;
    Object.defineProperty(target, key, {
      get(this: Component) {
        if (!this.$rendered) {
          const expression = `${this.$id}.${key}`;
          return Parser.expressionStartString + expression + Parser.expressionEndString;
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
