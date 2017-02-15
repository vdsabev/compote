module examples.todomvc {
  const { Mithril } = compote.core;
  const { div, input } = compote.html.HTML;

  class TodoItemComponent {
    view() {
      return div(Object.assign({
        className: 'fade-in-animation'
      }, {
        onbeforeremove: ({ dom }: { dom: HTMLElement }) => {
          dom.classList.add('fade-out-animation');
          return new Promise((resolve) => setTimeout(resolve, 500));
        }
      }), this.edit ?
        input(Object.assign({
          oncreate: ({ dom }: { dom: HTMLElement }) => { // TODO: Type
            dom.focus();
          }
        }, {
          type: 'text',
          value: this.item.title,
          onkeyup: ($event: KeyboardEvent) => {
            if ($event.which === Keyboard.ENTER) {
              this.edit = false;
            }
            else {
              this.item.title = (<HTMLInputElement>$event.target).value.trim();
            }
          },
          onblur: () => {
            this.edit = false;
          }
        }))
        :
        div({
          ondblclick: ($event: Event) => {
            this.edit = true;
          }
        }, this.item.title)
      );
    }

    edit: boolean;

    constructor(private item: Todo) {
    }
  };

  export function TodoItem(item: Todo) {
    return Mithril(new TodoItemComponent(item));
  }
}
