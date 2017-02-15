module examples.todomvc {
  import App = compote.core.App;
  const { Mithril } = compote.core;
  const { h1, input } = compote.html.HTML;

  export class TodoApp implements App {
    constructor() {
      this.update();
    }

    items: TodoItem[] = [];

    update() {
      Mithril.render(document.querySelector('#container'), this.render(this));
    }

    render(app: TodoApp) {
      return [
        h1({}, 'todos'),
        input({
          type: 'text',
          placeholder: 'What needs to be done?',
          autofocus: true,
          onkeyup: ($event: KeyboardEvent) => {
            const $el = <HTMLInputElement>$event.target;
            const value = $el.value.trim();
            if ($event.which === Keyboard.ENTER && value) {
              this.items.push(new TodoItem(new Todo(value)));
              $el.value = '';
              app.update();
            }
          }
        }),
        ...this.items.map((item: TodoItem) => item.render(this))
      ];
    }
  }

  // Initialize
  new TodoApp();
}
