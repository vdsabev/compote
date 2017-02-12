module examples.virtualDom {
  const { Component } = compote.core;
  const { div, h1, input } = compote.html;

  function App() {
    return new AppComponent();
  }

  class AppComponent extends Component {
    render() {
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
              this.items.push(new Todo(value));
              $el.value = '';
              this.update();
            }
          }
        }),
        this.items.map((item) => TodoItem({ item }))
      ]);
    }

    items: Todo[] = [];
  }

  function TodoItem(data: Partial<TodoItemComponent>) {
    return new TodoItemComponent(data).render();
  }

  // TODO: Fix update
  class TodoItemComponent extends Component {
    render() {
      return this.edit ?
        input({
          type: 'text',
          autofocus: true,
          value: this.item.title,
          onkeyup: ($event: KeyboardEvent) => {
            if ($event.which === Keyboard.ENTER) {
              this.edit = false;
            }
            else {
              this.item.title = (<HTMLInputElement>$event.target).value.trim();
            }
            this.update();
          },
          onblur: () => {
            this.edit = false;
            this.update();
          }
        })
        :
        div({
          ondblclick: () => {
            this.edit = true;
            this.update();
          }
        }, this.item.title);
    }

    item: Todo;
    edit: boolean;
  }

  class Todo {
    static id = 0;

    id: number;
    completed: boolean;

    constructor(public title: string) {
      this.id = Todo.id;
      Todo.id++;
    }
  }

  Component.mount(App(), document.querySelector('#container'));
}
