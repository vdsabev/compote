module compote.core {
  /** Component */
  export const componentInstancesCache: Record<string, Component> = (<any>window).Compote = {};

  export type ComponentTree = string | [ComponentAttributes<Component>, any];

  export type ComponentAttributes<DataType> = {
    [key: string]: any
    Component?: typeof Component
    class?: string
    data?: ComponentData<DataType>
    if?: string
    style?: Record<string, string>
    tagName?: string
    unless?: string
  };

  type ComponentData<DataType> = Partial<DataType>;

  export interface Component {
    $onInit?(): void;
    $onDestroy?(): void;
  }

  export class Component {
    private static reservedAttributeKeys = ['Component', 'data', 'if', 'unless', 'tagName'];

    $id: string;
    // private $comment: Comment;
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
      if (this.$el.nodeType === Node.ELEMENT_NODE) {
        this.$children.forEach((child) => child.$appendTo(<HTMLElement>this.$el));
      }

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
          // TODO: Handle empty style properties, e.g. `background: `
          const attributeValue = this.$getAttributeValue(attributeKey, this.$attributes[attributeKey]);
          const parsedExpression = Parser.parse(attributeValue);
          if (parsedExpression !== attributeValue) {
            $el.setAttribute(attributeKey, parsedExpression);
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

        let component: Component;
        if (typeof childTree === 'string') {
          component = new Component(childTree);
        }
        else {
          const ComponentClass = childTree[0].Component || Component;
          component = new ComponentClass(childTree[0], childTree[1]);
        }

        children.push(component);
        component.$appendTo($el);
      });
    }

    private $updateChildren(children: Component[]) {
      children.forEach((child: Component) => child.$update());
    }

    $update() {
      if (this.$initializing) {
        Renderer.defer(() => this.$update());
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
        this.$updateChildren(this.$children);
        // TODO: Update sibling & parent bindings
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

      // Preserve appending order of children when debugging
      // this.$comment.parentNode.replaceChild(this.$el, this.$comment);
      // if (this.$attributes.if) {
      //   const parsedIfExpression = Parser.parse(this.$attributes.if);
      //   if (parsedIfExpression !== 'true') {
      //     this.$el = document.createComment(this.$id);
      //   }
      // }
      $container.appendChild(this.$el);
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
