module compote.core {
  /** Caches */
  const componentInstancesCache: Record<string, Component> = (<any>window).Compote = {};

  /** HTML tags */
  // http://www.quackit.com/html_5/tags
  export const HTML = {
    a: tag('a'),
    abbr: tag('abbr'),
    address: tag('address'),
    area: tag('area'),
    article: tag('article'),
    aside: tag('aside'),
    audio: tag('audio'),
    b: tag('b'),
    base: tag('base'),
    bdi: tag('bdi'),
    bdo: tag('bdo'),
    blockquote: tag('blockquote'),
    body: tag('body'),
    br: tag('br'),
    button: tag('button'),
    canvas: tag('canvas'),
    caption: tag('caption'),
    cite: tag('cite'),
    code: tag('code'),
    col: tag('col'),
    colgroup: tag('colgroup'),
    data: tag('data'),
    datalist: tag('datalist'),
    dd: tag('dd'),
    del: tag('del'),
    details: tag('details'),
    dfn: tag('dfn'),
    dialog: tag('dialog'),
    div: tag('div'),
    dl: tag('dl'),
    dt: tag('dt'),
    em: tag('em'),
    embed: tag('embed'),
    fieldset: tag('fieldset'),
    figcaption: tag('figcaption'),
    figure: tag('figure'),
    footer: tag('footer'),
    form: tag('form'),
    h1: tag('h1'),
    h2: tag('h2'),
    h3: tag('h3'),
    h4: tag('h4'),
    h5: tag('h5'),
    h6: tag('h6'),
    head: tag('head'),
    header: tag('header'),
    hgroup: tag('hgroup'),
    hr: tag('hr'),
    html: tag('html'),
    i: tag('i'),
    iframe: tag('iframe'),
    img: tag('img'),
    input: tag('input'),
    ins: tag('ins'),
    kbd: tag('kbd'),
    keygen: tag('keygen'),
    label: tag('label'),
    legend: tag('legend'),
    li: tag('li'),
    link: tag('link'),
    main: tag('main'),
    map: tag('map'),
    mark: tag('mark'),
    menu: tag('menu'),
    menuitem: tag('menuitem'),
    meta: tag('meta'),
    meter: tag('meter'),
    nav: tag('nav'),
    noscript: tag('noscript'),
    object: tag('object'),
    ol: tag('ol'),
    optgroup: tag('optgroup'),
    option: tag('option'),
    output: tag('output'),
    p: tag('p'),
    param: tag('param'),
    pre: tag('pre'),
    progress: tag('progress'),
    q: tag('q'),
    rb: tag('rb'),
    rp: tag('rp'),
    rt: tag('rt'),
    rtc: tag('rtc'),
    ruby: tag('ruby'),
    s: tag('s'),
    samp: tag('samp'),
    script: tag('script'),
    section: tag('section'),
    select: tag('select'),
    small: tag('small'),
    source: tag('source'),
    span: tag('span'),
    strong: tag('strong'),
    style: tag('style'),
    sub: tag('sub'),
    summary: tag('summary'),
    sup: tag('sup'),
    table: tag('table'),
    tbody: tag('tbody'),
    td: tag('td'),
    template: tag('template'),
    textarea: tag('textarea'),
    tfoot: tag('tfoot'),
    th: tag('th'),
    thead: tag('thead'),
    time: tag('time'),
    title: tag('title'),
    tr: tag('tr'),
    track: tag('track'),
    u: tag('u'),
    ul: tag('ul'),
    var: tag('var'),
    video: tag('video'),
    wbr: tag('wbr')
  };

  export function tag(tagName: string) {
    return (attributes?: ComponentAttributes<Component>, children?: ComponentTree | ComponentTree[]): ComponentTree => {
      return [Object.assign({ tagName }, attributes), children];
    };
  }

  /** Parser */
  export class Parser {
    // TODO: Interpolate more than 1 expression in a string
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = '(\\w+)\\.(\\w+)';
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static parseExpression(expression: string): string {
      const matches = expression && expression.toString().match(Parser.expressionRegex);
      if (!(matches && matches.length > 0)) return expression; // Move along, nothing to parse here...

      const [componentId, componentKey] = matches.slice(1, 3);
      const value = (<any>componentInstancesCache[componentId])[componentKey];
      const parsedExpression = expression.replace(Parser.expressionRegex, value != null ? value : '');
      return Parser.parseExpression(parsedExpression);
    }
  }

  /** Renderer */
  export class Renderer {
    static defer: (fn: Function) => void;
    static document: Document;
  }

  /** Component */
  export type ComponentTree = string | [ComponentAttributes<Component>, any];

  export type ComponentAttributes<DataType> = {
    [key: string]: any
    Component?: typeof Component
    data?: ComponentData<DataType>
    tagName?: string
  };

  type ComponentData<DataType> = Partial<DataType>;

  export interface Component {
    $onInit?(): void;
    $onDestroy?(): void;
  }

  export class Component {
    private static reservedAttributes = ['Component', 'data', 'tagName'];

    $id = uniqueId(`${this.constructor.name}_`);
    $el: HTMLElement | Text;
    $initializing: boolean;
    $rendering: boolean;

    private $textContent: string;
    private $attributes: ComponentAttributes<Component> = {};
    private $children: Component[] = [];

    private $constructorTextContent: string;
    private $constructorAttributes: ComponentAttributes<Component> = {};
    private $constructorChildren: ComponentTree | ComponentTree[] = [];

    constructor(
      attributes: string | ComponentAttributes<Component> = {},
      children: ComponentTree | ComponentTree[] = []
    ) {
      componentInstancesCache[this.$id] = this;

      if (typeof attributes === 'string') {
        this.$constructorTextContent = attributes; // Switch arguments
      }
      else {
        this.$constructorAttributes = attributes;
        this.$constructorChildren = children;
      }

      this.$initializing = true;
      Renderer.defer(() => this.$init());
    }

    private $init() {
      this.$rendering = true;
      const tree = this.$render();
      this.$rendering = false;

      if (typeof tree === 'string') {
        this.$textContent = tree;
        this.$el = Renderer.document.createTextNode(this.$textContent);
      }
      else {
        // Attributes
        const attributes = tree[0];
        Object.assign(this.$attributes, attributes, this.$constructorAttributes);
        Object.assign(this, this.$attributes.data, this.$constructorAttributes.data);

        this.$el = Renderer.document.createElement(this.$attributes['tagName'] || 'div');
        this.$setAttributes(this.$el, this.$attributes);
        this.$updateAttributeExpressions(this.$el, this.$attributes);

        // Children
        let children: ComponentTree | ComponentTree[] = tree[1];
        if (!Array.isArray(children)) {
          children = [children];
        }

        this.$setChildren(this.$el, this.$children, children);
        this.$updateChildren(this.$children);
      }

      if (this.$onInit) {
        this.$onInit();
      }

      this.$initializing = false;
    }

    $render(): ComponentTree {
      return this.$constructorTextContent || [this.$constructorAttributes, this.$constructorChildren];
    }

    // TODO: Only update changed expressions
    private $setAttributes($el: HTMLElement, attributes: ComponentAttributes<Component>) {
      for (let key in attributes) {
        if (this.$attributeIsAllowed(attributes, key)) {
          $el.setAttribute(key, attributes[key]);
        }
      }
    }

    private $updateAttributeExpressions($el: HTMLElement, attributes: ComponentAttributes<Component>) {
      for (let key in attributes) {
        if (this.$attributeIsAllowed(attributes, key)) {
          const expression = this.$attributes[key];
          const parsedExpression = Parser.parseExpression(expression);
          if (parsedExpression !== expression) {
            $el.setAttribute(key, parsedExpression);
          }
        }
      }
    }

    private $attributeIsAllowed(attributes: ComponentAttributes<Component>, key: string): boolean {
      return attributes.hasOwnProperty(key) && Component.reservedAttributes.indexOf(key) === -1;
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

      if (this.$el.nodeType === Node.ELEMENT_NODE) {
        this.$updateAttributeExpressions(<HTMLElement>this.$el, this.$attributes);
        this.$updateChildren(this.$children);
      }
      else if (this.$el.nodeType === Node.TEXT_NODE) {
        const expression = this.$textContent;
        const parsedExpression = Parser.parseExpression(expression);
        if (parsedExpression !== expression) {
          this.$el.textContent = parsedExpression;
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

      // TODO: Preserve appending order of children when rendering
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

  /** Decorators */
  export function bind(target: Component, key: string, propertyDescriptor?: PropertyDescriptor): any {
    // Class method
    if (propertyDescriptor && typeof propertyDescriptor.value === 'function') {
      const originalMethod = propertyDescriptor.value;
      propertyDescriptor.value = function (...args: any[]): any {
        if (this.$rendering) {
          return `Compote.${this.$id}.${key}(event)`;
        }
        originalMethod.apply(this, args);
      };
    }
    // Class property
    else {
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
  }

  /** Utils */
  let idCounter = -1;
  function uniqueId(prefix = '') {
    idCounter++;
    return prefix + idCounter.toString();
  }
}
