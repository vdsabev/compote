import * as m from 'mithril';
import { h1, input } from '../../compote';

import { App } from './component';
import Keyboard from './keyboard';
import TodoItem from './todo-item';
import Todo from './todo';

export default class TodoApp implements App {
  constructor() {
    this.update();
  }

  items: TodoItem[] = [];

  update() {
    m.render(document.querySelector('#container'), this.render());
  }

  render() {
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
            this.update();
          }
        }
      }),
      ...this.items.map((item: TodoItem) => item.render())
    ];
  }

  addItem(title: string) {
    this.items.push(new TodoItem(this, {
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
