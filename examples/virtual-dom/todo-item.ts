module examples.virtualDom {
  import App = compote.core.App;
  const { div, input } = compote.html;

  export function TodoItem(app: App, item: Partial<Todo>) { // TODO: type `Component`
    return item.edit ?
      input(Object.assign({ 'focus-hook': new FocusHook() }, {
        type: 'text',
        value: item.title,
        onkeyup($event: KeyboardEvent) {
          if ($event.which === Keyboard.ENTER) {
            item.edit = false;
          }
          else {
            item.title = (<HTMLInputElement>$event.target).value.trim();
          }
          app.update();
        },
        onblur() {
          item.edit = false;
          app.update();
        }
      }))
      :
      div({
        ondblclick($event: Event) {
          item.edit = true;
          app.update();
        }
      }, item.title);
  }
}
