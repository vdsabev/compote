module compote.examples.todomvc {
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
    $render(): any; // TODO: Type
  }

  type ComponentProperties<ComponentType> = Partial<HTMLElement> & {
    $data?: Partial<ComponentType>
  };

  function component<ComponentType extends Component>(ComponentClass: { new(): ComponentType }) {
    return (properties?: ComponentProperties<ComponentType>) => {
      return [ComponentClass, properties];
    };
  }

  /** TodoApp */
  const TodoInput = component(TodoInputComponent);
  const TodoItem = component(TodoItemComponent);

  export class TodoAppComponent implements Component {
    $render() {
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

  /** TodoInput */
  export class TodoInputComponent implements Component {
   $render() {
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

  /** TodoItem */
  export class TodoItemComponent implements Component {
   $render() {
      return div({}, this.item);
    }

    item: string;
  }

  /** Bootstrap */
  bootstrap();

  function bootstrap() {
    const $container = document.getElementById('container');
    while ($container.firstChild) {
      $container.removeChild($container.lastChild);
    }

    const $pre = document.createElement('pre');
    $container.appendChild($pre);

    const todoApp = new TodoAppComponent();

    let counter = 0;
    setInterval(() => {
      if (todoApp.items.length >= 3) {
        todoApp.items.shift();
      }

      todoApp.items.push(counter.toString());
      counter++;

      $pre.textContent = JSON.stringify(todoApp.$render(), null, 2);
    }, 1e3);
  }
}
