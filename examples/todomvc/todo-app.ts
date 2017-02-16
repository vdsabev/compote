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
        h1('todos'),
        input({
          type: 'text',
          placeholder: 'What needs to be done?',
          autofocus: true,
          onkeypress: ($event: KeyboardEvent) => {
            const $el = <HTMLInputElement>$event.target;
            const value = $el.value.trim();
            if ($event.which === Keyboard.ENTER && value) {
              this.addItem(value);
              $el.value = '';
              app.update();
            }
          }
        }),
        ...this.items.map((item: TodoItem) => item.render(this))
      ];
    }

    addItem(title: string) {
      this.items.push(new TodoItem({
        item: new Todo(title),
        onDelete: (item: TodoItem) => {
          const indexOfItem = this.items.indexOf(item);
          if (indexOfItem !== -1) {
            this.items.splice(indexOfItem, 1);
          }
        }
      }));
    }
  }

  // Initialize
  new TodoApp();
}
