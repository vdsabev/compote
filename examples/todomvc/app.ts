module examples.virtualDom {
  import App = compote.core.App;
  const { div, h1, input } = compote.html.HTML;

  function TodoApp(app: App, todoApp: TodoAppController): VirtualDOM.VNode {
    return div({}, [
      h1({}, 'todos'),
      input({
        type: 'text',
        placeholder: 'What needs to be done?',
        autofocus: true,
        onkeyup: ($event: KeyboardEvent) => {
          const $el = <HTMLInputElement>$event.target;
          const value = $el.value.trim();
          if ($event.which === Keyboard.ENTER && value) {
            todoApp.items.push(new Todo(value));
            $el.value = '';
            app.update();
          }
        }
      }),
      ...todoApp.items.map((item) => TodoItem(app, item))
    ]);
  }

  class TodoAppController {
    items: Todo[] = [];
  }

  export class Todo {
    static id = 0;

    id: number;
    completed: boolean;
    edit: boolean;

    constructor(public title: string) {
      this.id = Todo.id;
      Todo.id++;
    }
  }

  // Initialize
  const todoAppController = new TodoAppController();
  new App({
    render: (app: App) => TodoApp(app, todoAppController),
    container: document.querySelector('#container')
  });
}
