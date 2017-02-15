module examples.todomvc {
  const { Mithril } = compote.core;
  const { h1, input } = compote.html.HTML;

  class TodoAppComponent {
    view() {
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
              this.items.push(new Todo(value));
              $el.value = '';
            }
            else {
              (<any>$event).redraw = false; // TODO: Type
            }
          }
        }),
        this.items.map((item: Todo) => TodoItem(item))
      ];
    }

    items: Todo[] = [];
  };

  // Initialize
  Mithril.mount(document.querySelector('#container'), new TodoAppComponent());
}
