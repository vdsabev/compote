module compote.core {
  /** Component */
  export const componentInstancesCache: Record<string, Component> = (<any>window).Compote = {};

  export type ComponentTree = string | [ComponentAttributes<Component>, any];

  export type ComponentAttributes<DataType> = {
    [key: string]: any
    Component?: typeof Component
    class?: string
    data?: ComponentData<DataType>
    if?: any
    style?: Record<string, string>
    tagName?: string
    unless?: any
  };

  type ComponentData<DataType> = Partial<DataType>;

  export interface Component {
    $onInit?(): void;
    $onDestroy?(): void;
  }

  export class Component {
    private static reservedAttributeKeys = ['Component', 'data', 'if', 'unless', 'tagName'];

    $id: string;
    private $comment: Comment;
    private $el: HTMLElement | Text;
    private $initializing: boolean;
    $rendering: boolean;

    private $textContent: string;
    private $attributes: ComponentAttributes<Component> = {};
    private $children: Component[] = [];

    private $constructorTextContent: string;
    private $constructorAttributes: ComponentAttributes<Component> = {};
    // TODO: Use rest parameters instead of array
    private $constructorChildren: ComponentTree | ComponentTree[] = [];

    constructor(
      attributes: string | ComponentAttributes<Component> = {},
      children: ComponentTree | ComponentTree[] = []
    ) {
      this.$id = uniqueId(`${this.constructor.name}_`);
      // this.$comment = document.createComment(this.$id);
      componentInstancesCache[this.$id] = this;

      if (typeof attributes === 'string') {
        this.$constructorTextContent = attributes; // Switch arguments
      }
      else {
        this.$constructorAttributes = attributes;
        this.$constructorChildren = children;
      }

      this.$initializing = true;

      this.$rendering = true;
      const tree = this.$render();
      this.$rendering = false;

      if (typeof tree === 'string') {
        this.$textContent = tree;
        this.$el = Renderer.document.createTextNode(this.$textContent);
      }
      else {
        // Attributes
        const treeAttributes = tree[0];
        Object.assign(this.$attributes, treeAttributes, this.$constructorAttributes);
        Object.assign(this, this.$attributes.data, this.$constructorAttributes.data);

        this.$el = Renderer.document.createElement(this.$attributes.tagName || 'div');
        this.$setAttributes(this.$el, this.$attributes);

        // Children
        let treeChildren: ComponentTree | ComponentTree[] = tree[1];
        if (!Array.isArray(treeChildren)) {
          treeChildren = [treeChildren];
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
      return this.$constructorTextContent || [this.$constructorAttributes, this.$constructorChildren];
    }

    private $setAttributes($el: HTMLElement, attributes: ComponentAttributes<Component>) {
      for (let attributeKey in attributes) {
        if (this.$attributeIsAllowed(attributes, attributeKey)) {
          const attributeValue = attributes[attributeKey];
          $el.setAttribute(attributeKey, this.$getAttributeValue(attributeKey, attributeValue));
        }
      }
    }

    private $updateAttributeExpressions($el: HTMLElement, attributes: ComponentAttributes<Component>) {
      for (let attributeKey in attributes) {
        if (this.$attributeIsAllowed(attributes, attributeKey)) {
          const attributeValue = this.$getAttributeValue(attributeKey, attributes[attributeKey]);
          let parsedExpression = Parser.parse(attributeValue);

          if (attributeKey === 'style') {
            const styleRules: string[] = [];
            parsedExpression.split(/\s*;\s*/).forEach((styleRule) => {
              const [property, value] = styleRule.split(/\s*:\s*/);
              if (value) {
                styleRules.push(`${property}: ${value};`);
              }
            });
            parsedExpression = styleRules.join(' ');
          }

          if (parsedExpression !== attributeValue) {
            $el.setAttribute(attributeKey, parsedExpression);
          }
        }
        else if (attributeKey === 'if' || attributeKey === 'unless') {
          const parsedConditionalExpression = Parser.parse(attributes.if || attributes.unless);

          if (attributeKey === 'if') {
            this.$replaceConditionalNode(parsedConditionalExpression === 'true');
          }
          else if (attributeKey === 'unless') {
            this.$replaceConditionalNode(parsedConditionalExpression !== 'true');
          }
        }
      }
    }

    private $attributeIsAllowed(attributes: ComponentAttributes<Component>, key: string): boolean {
      return attributes.hasOwnProperty(key) && Component.reservedAttributeKeys.indexOf(key) === -1;
    }

    private $getAttributeValue(attributeKey: string, attributeValue: any): string {
      switch (attributeKey) {
        case 'class':
          return attributeValue.replace(/\./g, ' ');
        case 'style':
          if (typeof attributeValue === 'object') {
            const style: string[] = [];
            for (let propertyKey in attributeValue) {
              if (attributeValue.hasOwnProperty(propertyKey)) {
                const propertyValue = attributeValue[propertyKey];
                if (propertyValue) {
                  style.push(`${propertyKey}: ${propertyValue}`);
                }
              }
            }
            return style.join('; ');
          }
          /* falls through */
        default:
          return attributeValue;
      }
    }

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

    $update(changes: Record<string, any>) {
      if (this.$initializing) {
        Renderer.defer(() => this.$update(changes));
        return;
      }

      if (this.$el.nodeType === Node.TEXT_NODE) {
        const expression = this.$textContent;
        const parsedExpression = Parser.parse(expression);
        if (parsedExpression !== expression) {
          this.$el.textContent = parsedExpression;
        }
      }
      else if (this.$el.nodeType === Node.ELEMENT_NODE) {
        this.$updateAttributeExpressions(<HTMLElement>this.$el, this.$attributes);
        this.$children.forEach((child) => child.$update(changes));
        // TODO: Update sibling & parent bindings
      }
    }

    private $replaceConditionalNode(condition: boolean) {
      if (condition) {
        if (this.$comment.parentNode) {
          this.$comment.parentNode.replaceChild(this.$el, this.$comment);
        }
      }
      else {
        if (this.$el.parentNode) {
          this.$el.parentNode.replaceChild(this.$comment, this.$el);
        }
      }
    }

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
      if (this.$attributes.if || this.$attributes.unless) {
        this.$comment = document.createComment(this.$id);
        const parsedConditionalExpression = Parser.parse(this.$attributes.if || this.$attributes.unless);

        if (this.$attributes.if) {
          appendEl = parsedConditionalExpression === 'true';
        }
        else if (this.$attributes.unless) {
          appendEl = parsedConditionalExpression !== 'true';
        }
      }

      $container.appendChild(appendEl ? this.$el : this.$comment);
    }

    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    private $removeAllChildren($el: HTMLElement) {
      while ($el.firstChild) {
        $el.removeChild($el.lastChild);
      }
    }

    $destroy() {
      if (this.$onDestroy) {
        this.$onDestroy();
      }

      this.$el.parentNode.removeChild(this.$el);
      delete componentInstancesCache[this.$id];
    }
  }
}
