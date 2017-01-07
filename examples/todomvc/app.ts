module compote.examples.todomvc {
  /** Compote */
  export class Compote {
    private static components: Record<string, any> = {};

    static mount(ComponentClass: { new(): Component }, $container: HTMLElement) {
      const tree = Compote.parseTree([ComponentClass]);
      $container.textContent = '';
      Compote.sync(tree, $container);
    }

    private static parseTree(tree: any): any {
      let [tagName, properties, children] = tree;

      if (typeof tagName === 'function') {
        const ComponentClass = tagName;
        const componentInstance = new ComponentClass();
        if (properties && properties.$data) {
          Object.assign(componentInstance, properties.$data);
        }

        let [componentTagName, componentProperties, componentChildren] = Compote.parseTree(componentInstance.render());

        if (componentProperties) {
          if (componentProperties.$data) {
            Object.assign(componentInstance, componentProperties.$data);
          }

          Object.assign(componentProperties, properties);
        }
        else {
          componentProperties = properties;
        }

        return [componentTagName, componentProperties, children || componentChildren];
      }

      if (typeof properties === 'string') {
        properties = { textContent: properties };
      }
      else if (Array.isArray(properties)) {
        children = properties;
        properties = undefined;
      }
      else if (typeof children === 'string') {
        properties.textContent = children;
        children = undefined;
      }

      if (children) {
        children.forEach((child: any, index: number) => {
          if (Array.isArray(child)) {
            children[index] = Compote.parseTree(child);
          }
        });
      }

      return [tagName, properties, children];
    }

    private static sync(tree: any, $container: HTMLElement) {
      if (typeof tree === 'string') {
        const $el = document.createTextNode(tree);
        $container.appendChild($el);
        return;
      }

      const [tagName, properties, children] = tree;
      const $el = document.createElement(tagName);

      for (let key in properties) {
        if (properties.hasOwnProperty(key) && key !== '$data') {
          $el[key] = properties[key];
        }
      }

      if (children) {
        children.forEach((child: any) => {
          Compote.sync(child, $el);
        });
      }

      $container.appendChild($el);
    }

    static registerComponent(componentId: string, component: Component) {
      Compote.components[componentId] = component;
    }

    static update(componentId: string) {
      // TODO: Implement
    }
  }

  /** HTML */
  const div = tag('div');
  const input = tag('input');

  function tag<TagNameType extends keyof HTMLElementTagNameMap, HTMLElementType extends HTMLElementTagNameMap[TagNameType]>(tagName: TagNameType) {
    return (properties: Partial<HTMLElementType>, children?: any) => {
      return [tagName, properties, children];
    };
  }

  /** Component */
  export abstract class Component {
    private $id: string;

    constructor() {
      this.$id = uniqueId(`${this.constructor.name}_`);
      Compote.registerComponent(this.$id, this);
    }

    abstract render(): any; // TODO: Type

    protected update() {
      Compote.update(this.$id);
    }
  }

  type ComponentProperties<ComponentType> = Partial<HTMLElement> & {
    $data?: Partial<ComponentType>
  };

  function component<ComponentType extends Component>(ComponentClass: { new(): ComponentType }) {
    return (properties?: ComponentProperties<ComponentType>) => {
      return [ComponentClass, properties];
    };
  }

  /** Utils */
  let idCounter = -1;
  export function uniqueId(prefix = '') {
    idCounter++;
    return prefix + idCounter.toString();
  }

  /** TodoInput */
  class TodoInputComponent extends Component {
   render() {
      return (
        input({
          autofocus: true,
          onkeyup: ($event: KeyboardEvent) => {
            const $el = <HTMLInputElement>$event.target;
            if ($event.which === 13 && $el.value) {
              this.addItem($el.value);
              $el.value = '';
            }
          }
        })
      );
    }

    addItem: (text: string) => void;
  }

  const TodoInput = component(TodoInputComponent);

  /** TodoItem */
  class TodoItemComponent extends Component {
   render() {
      return div({}, this.item);
    }

    item: string;
  }

  const TodoItem = component(TodoItemComponent);

  /** TodoApp */
  class TodoAppComponent extends Component {
    render() {
      return (
        div({ className: 'todo-app' }, [
          TodoInput({
            $data: {
              addItem: (value: string) => {
                this.items.push(value);
                this.update();
              }
            }
          }),
          ...this.items.map((item) => TodoItem({ $data: { item } }))
        ])
      );
    }

    items: string[] = [];
  }

  /** Bootstrap */
  Compote.mount(TodoAppComponent, document.getElementById('container'));
}
