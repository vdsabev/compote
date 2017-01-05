module compote.examples.todomvc {
  const { Component, HTML, Value } = core;
  const { div, input } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({ class: 'todo-app' }, [
          TodoInput({
            $data: {
              addItem: (value: string) => {
                this.items.push(value);
              }
            }
          }),
          ...this.items.map((item) => div({}, item))
        ])
      );
    }

    @Value items: string[] = [];
  }

  /** Input */
  export function TodoInput(properties?: core.ComponentProperties<TodoInputComponent>): core.ComponentTree {
    return [Object.assign({ $component: TodoInputComponent }, properties), []];
  }

  export class TodoInputComponent extends Component {
    $render() {
      return input({
        autofocus: true,
        onKeyUp: ($event: KeyboardEvent) => {
          const $el = <HTMLInputElement>$event.target;
          if ($event.which === 13 && $el.value) {
            this.addItem($el.value);
            $el.value = '';
          }
        }
      });
    }

    addItem: (text: string) => void;
  }
}
