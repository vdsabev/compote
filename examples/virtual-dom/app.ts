module compote.examples.todomvc {
  // TODO: Types
  const { h, diff, patch, create } = (<any>window).virtualDom;

  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  };

  const div = tag('div');
  const button = tag('button');

  function tag<TagNameType extends keyof HTMLElementTagNameMap, HTMLElementType extends HTMLElementTagNameMap[TagNameType]>(tagName: TagNameType) {
    return (properties?: RecursivePartial<HTMLElementType>, children?: any) => {
      return h(tagName, properties, children);
    };
  }

  class Compote {
    static mount(ComponentClass: { new(): Component }, $container: HTMLElement) {
      const component = new ComponentClass();
      setTimeout(() => {
        $container.textContent = '';
        $container.appendChild(component.node);
      }, 0);
    }
  }

  abstract class Component {
    tree: any; // TODO: Type
    node: any; // TODO: Type

    constructor() {
      setTimeout(() => {
        this.tree = this.render();
        this.node = create(this.tree);
      }, 0);
    }

    abstract render(): any; // TODO: Type

    update() {
      const newTree = this.render();
      const patches = diff(this.tree, newTree);
      const patchedNode = patch(this.node, patches);
      this.tree = newTree;
      this.node = patchedNode;
    }
  }

  class AppComponent extends Component {
    render() {
      return div({}, [
        div({
          style: {
            textAlign: 'center',
            lineHeight: '100px',
            border: '1px solid red',
            width: '100px',
            height: '100px'
          }
        }, this.count),
        button({
          onclick: () => {
            this.count--;
            this.update();
          },
          style: { width: '51px' }
        }, '-'),
        button({
          onclick: () => {
            this.count++;
            this.update();
          },
          style: { width: '51px' }
        }, '+')
      ]);
    }

    count = 0;
  }

  Compote.mount(AppComponent, document.getElementById('container'));
}
