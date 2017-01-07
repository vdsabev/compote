module compote.examples.todomvc {
  /** Compote */
  export class Compote {
    static mount(ComponentClass: { new(): Component }, $container: HTMLElement) {
      const componentInstance = new ComponentClass();
      const [tagName, properties, children] = Compote.parseTree(componentInstance.render());

      if (children) {
        children.forEach((child: any) => {
          // TODO: Implement
        });
      }

      $container.textContent = '';
      const $el = document.createElement(tagName);
      Object.assign($el, properties);

      $container.appendChild($el);
    }

    static parseTree(tree: any) {
      let [tagName, properties, children] = tree;

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

      return [tagName, properties, children];
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
  interface Component {
    render(): any; // TODO: Type
  }

  type ComponentProperties<ComponentType> = Partial<HTMLElement> & {
    $data?: Partial<ComponentType>
  };

  function component<ComponentType extends Component>(ComponentClass: { new(): ComponentType }) {
    return (properties?: ComponentProperties<ComponentType>) => {
      return [ComponentClass, properties];
    };
  }

  /** TodoInput */
  export class TodoInputComponent implements Component {
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
  export class TodoItemComponent implements Component {
   render() {
      return div({}, this.item);
    }

    item: string;
  }

  const TodoItem = component(TodoItemComponent);

  /** TodoApp */
  export class TodoAppComponent implements Component {
    render() {
      return (
        div({ className: 'todo-app' }, [
          TodoInput({
            $data: {
              addItem: (value: string) => {
                this.items.push(value);
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
