module examples.todomvc {
  import Component = compote.core.Component;
  const { getAnimationDuration } = compote.css;
  const { div, input } = compote.html.HTML;

  export class TodoItem implements Component {
    constructor(private item: Todo) {
    }

    initialTitle: string;
    edit: boolean;

    render(app: TodoApp) {
      return div({
        className: 'fade-in-animation',
        onbeforeremove: ({ dom }: ComponentNode) => {
          dom.classList.add('fade-out-animation');
          return new Promise((resolve) => setTimeout(resolve, getAnimationDuration(dom) * 1e3));
        }
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
        oninit: () => {
          this.initialTitle = this.item.title;
        },
        oncreate: ({ dom }: ComponentNode) => {
          dom.focus();
        },
        type: 'text',
        value: this.item.title,
        onkeyup: ($event: KeyboardEvent) => {
          if ($event.which === Keyboard.ENTER) {
            this.stopEdit(app);
          }
          else if ($event.which === Keyboard.ESCAPE) {
            this.item.title = this.initialTitle;
            this.stopEdit(app);
          }
          else {
            this.item.title = (<HTMLInputElement>$event.target).value.trim();
            app.update();
          }
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
