module examples.virtualDom {
  import App = compote.core.App;
  const { div, input } = compote.html.HTML;

  export function TodoItem(app: App, item: Todo): VirtualDOM.VNode {
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