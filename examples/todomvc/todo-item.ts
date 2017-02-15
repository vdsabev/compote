module examples.todomvc {
  import Component = compote.core.Component;
  const { getAnimationDuration } = compote.css;
  const { div, input } = compote.html.HTML;

  export class TodoItem implements Component {
    constructor(data: Partial<TodoItem>) {
      Object.assign(this, data);
    }

    item: Todo;
    edit: boolean;
    onDelete: (item: TodoItem) => void;

    render(app: TodoApp) {
      return div({
        onbeforeremove: ({ dom }: ComponentNode) => {
          dom.classList.add('fade-out-animation');
          return new Promise((resolve) => setTimeout(resolve, getAnimationDuration(dom) * 1e3));
        },
        className: 'fade-in-animation'
      }, this.edit ? this.renderEditView(app) : this.renderShowView(app));
    }

    renderShowView(app: TodoApp) {
      return div({
        ondblclick: ($event: Event) => {
          this.startEdit(app);
        }
      }, this.item.title);
    }

    renderEditView(app: TodoApp) {
      return input({
        oncreate: ({ dom }: ComponentNode) => {
          dom.focus();
        },
        type: 'text',
        value: this.item.title,
        onkeydown: ($event: KeyboardEvent) => {
          if ($event.which === Keyboard.ESCAPE) {
            (<HTMLInputElement>$event.target).blur();
          }
        },
        onkeypress: ($event: KeyboardEvent) => {
          if ($event.which === Keyboard.ENTER) {
            (<HTMLInputElement>$event.target).blur();
          }
        },
        onblur: ($event: FocusEvent) => {
          this.item.title = (<HTMLInputElement>$event.target).value.trim();
          if (!this.item.title) {
            this.onDelete(this);
          }

          this.stopEdit(app);
        }
      });
    }

    startEdit(app: TodoApp) {
      this.edit = true;
      app.update();
    }

    stopEdit(app: TodoApp) {
      this.edit = false;
      app.update();
    }
  }
}
