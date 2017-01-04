module compote.core {
  /** Component */
  export const Compote: Record<string, Component> = {};

  type CompoteItem = { component: Component, functions: Record<string, Function> };

  export type ComponentTree = string | [ComponentProperties<Component>, any];

  export type ComponentProperties<DataType> = Partial<Node> & {
    [key: string]: any
    Component?: typeof Component
    class?: string
    data?: ComponentData<DataType>
    if?: any
    style?: string | Record<string, string>
    tagName?: string
    unless?: any
  };

  type ComponentData<DataType> = Partial<DataType>;

  // export type ComponentWatch = [string, string[]];

  export type ComponentWatch = { id: string, key: string };

  export interface Component {
    $onInit?(): void;
    $onUpdate?(changedDataKeys: string[]): void;
    $onDestroy?(): void;
  }

  export class Component {
    private static reservedPropertyKeys = ['Component', 'data', 'if', 'tagName', 'unless'];

    $id: string;
    private $comment: Comment;
    private $el: HTMLElement | Text;
    $initializing: boolean;
    $rendering: boolean;
    $propertyWatches: {
      [key: string]: ComponentWatch[]
    };
    $methodWatches: {
      [key: string]: string[]
    };

    private $properties: ComponentProperties<Component> = {};
    private $children: Component[] = [];

    private $constructorProperties: ComponentProperties<Component> = {};
    // TODO: Use rest parameters instead of array
    private $constructorChildren: ComponentTree | ComponentTree[] = [];

    constructor(
      properties: string | ComponentProperties<Component> = {},
      children: ComponentTree | ComponentTree[] = []
    ) {
      this.$initializing = true;

      this.$id = uniqueId(`${this.constructor.name}_`);
      Compote[this.$id] = this;

      if (typeof properties === 'string') {
        this.$constructorProperties = { textContent: properties }; // Switch arguments
      }
      else {
        this.$constructorProperties = properties;
        Object.assign(this.$properties, this.$constructorProperties);
        Object.assign(this, this.$constructorProperties.data);

        this.$constructorChildren = children;
      }

      this.$rendering = true;
      const tree = this.$render();
      this.$rendering = false;

      if (typeof tree === 'string') {
        this.$properties = { textContent: tree };
        this.$el = Renderer.document.createTextNode(this.$properties.textContent);
        this.$setProperties(this.$el, this.$properties);
      }
      else {
        // Properties
        const treeProperties = tree[0];
        Object.assign(this.$properties, treeProperties);
        Object.assign(this, this.$properties.data);

        this.$el = Renderer.document.createElement(this.$properties.tagName || 'div');
        this.$setProperties(this.$el, this.$properties);

        // Children
        // TODO: Support setting a single string as `textContent` without creating a text node
        let treeChildren: ComponentTree | ComponentTree[] = tree[1];
        if (!Array.isArray(treeChildren)) {
          // if (typeof treeChildren === 'string') {
          //   this.$properties.textContent = treeChildren;
          // }
          // else {
          treeChildren = [treeChildren];
          // }
        }

        this.$setChildren(this.$el, this.$children, treeChildren);
      }

      Renderer.defer(() => this.$init());
    }

    private $init() {
      if (this.$onInit) {
        this.$onInit();
      }

      this.$initializing = false;
    }

    $render(): ComponentTree {
      return this.$constructorProperties.textContent || [this.$constructorProperties, this.$constructorChildren];
    }

    private $setProperties($el: HTMLElement | Text, properties: ComponentProperties<Component>) {
      for (let propertyKey in properties) {
        if (!this.$propertyIsAllowed(properties, propertyKey)) continue;

        const propertyValue = this.$getPropertyValue(propertyKey, properties[propertyKey]);

        if (typeof propertyValue === 'function') {
          propertyKey = propertyKey.toLowerCase();
        }
        else {
          const watches = Parser.getExpressionWatches(propertyValue);
          if (watches) {
            if (!this.$propertyWatches) {
              this.$propertyWatches = {};
            }

            this.$propertyWatches[propertyKey] = watches;
          }
        }

        (<any>$el)[propertyKey] = propertyValue;
      }
    }

    private $propertyIsAllowed(properties: ComponentProperties<Component>, key: string): boolean {
      return properties.hasOwnProperty(key) && Component.reservedPropertyKeys.indexOf(key) === -1;
    }

    private $getPropertyValue(propertyKey: string, propertyValue: any): any {
      switch (propertyKey) {
        case 'class':
          return propertyValue.replace(/\./g, ' ');
        case 'style':
          if (typeof propertyValue === 'object') {
            const style: string[] = [];
            for (let stylePropertyKey in propertyValue) {
              if (propertyValue.hasOwnProperty(stylePropertyKey)) {
                const stylePropertyValue = propertyValue[stylePropertyKey];
                if (stylePropertyValue) {
                  style.push(`${stylePropertyKey}: ${stylePropertyValue};`);
                }
              }
            }
            return style.join(' ');
          }
          /* falls through */
        default:
          return propertyValue;
      }
    }

    // private $updateAttributeExpressions($el: HTMLElement, attributes: ComponentAttributes<Component>) {
    //   for (let attributeKey in attributes) {
    //     if (this.$attributeIsAllowed(attributes, attributeKey)) {
    //       ...
    //     }
    //     else if (attributeKey === 'if' || attributeKey === 'unless') {
    //       const parsedConditionalExpression = Parser.evaluate(attributes.if || attributes.unless);
    //
    //       if (attributeKey === 'if') {
    //         this.$replaceConditionalNode(parsedConditionalExpression === 'true');
    //       }
    //       else if (attributeKey === 'unless') {
    //         this.$replaceConditionalNode(parsedConditionalExpression !== 'true');
    //       }
    //     }
    //   }
    // }

    private $setChildren($el: HTMLElement, children: Component[], childTrees: ComponentTree[]) {
      childTrees.forEach((childTree) => {
        if (!childTree) return;

        let childComponent: Component;
        if (typeof childTree === 'string') {
          childComponent = new Component(childTree);
        }
        else {
          const ComponentClass = childTree[0].Component || Component;
          childComponent = new ComponentClass(childTree[0], childTree[1]);
        }

        children.push(childComponent);
        childComponent.$appendTo($el);
      });
    }

    $update(componentId: string, changedDataKeys?: string[]) {
      for (let propertyKey in this.$propertyWatches) {
        if (this.$propertyWatches.hasOwnProperty(propertyKey)) {
          const watches = this.$propertyWatches[propertyKey];
          watches.forEach((watch) => {
            if (watch.id === componentId && !(changedDataKeys && changedDataKeys.indexOf(watch.key) === -1)) {
              const propertyValue = this.$getPropertyValue(propertyKey, this.$properties[propertyKey]);
              (<any>this.$el)[propertyKey] = Parser.evaluate(propertyValue.toString());
            }
          });
        }
      }

      this.$children.forEach((child) => child.$update(componentId, changedDataKeys));

      if (this.$onUpdate && componentId === this.$id && changedDataKeys) {
        this.$onUpdate(changedDataKeys);
      }
    }

    // private $replaceConditionalNode(condition: boolean) {
    //   if (condition) {
    //     if (this.$comment.parentNode) {
    //       this.$comment.parentNode.replaceChild(this.$el, this.$comment);
    //     }
    //   }
    //   else {
    //     if (this.$el.parentNode) {
    //       this.$el.parentNode.replaceChild(this.$comment, this.$el);
    //     }
    //   }
    // }

    private $appendTo($container: HTMLElement) {
      this.$mountTo($container, false);
    }

    $mountTo($container: HTMLElement, removeAllChildren = true) {
      if (this.$initializing) {
        Renderer.defer(() => this.$mountTo($container, removeAllChildren));
        return;
      }

      if (removeAllChildren) {
        this.$removeAllChildren($container);
      }

      let appendEl = true;
      // if (this.$properties.if || this.$properties.unless) {
      //   this.$comment = document.createComment(this.$id);
      //   const parsedConditionalExpression = Parser.evaluate(this.$properties.if || this.$properties.unless);
      //
      //   if (this.$properties.if) {
      //     appendEl = parsedConditionalExpression === 'true';
      //   }
      //   else if (this.$properties.unless) {
      //     appendEl = parsedConditionalExpression !== 'true';
      //   }
      // }

      this.$update(this.$id);
      $container.appendChild(appendEl ? this.$el : this.$comment);
    }

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    private $removeAllChildren($el: HTMLElement) {
      while ($el.firstChild) {
        $el.removeChild($el.lastChild);
      }
    }

    $destroy() {
      // TODO: Destroy children

      if (this.$onDestroy) {
        this.$onDestroy();
      }

      this.$el.parentNode.removeChild(this.$el);
      delete Compote[this.$id];
    }
  }
}
