import { Component, ComponentNode } from '../../src/core';
import { getAnimationDuration } from '../../src/css';
import { div, input } from '../../src/html';

import Keyboard from './keyboard';
import Todo from './todo';

export default class TodoItem extends Component<TodoItem> {
  item: Todo;
  edit: boolean;
  onDelete: (item: TodoItem) => void;

  render() {
    return (
      div({
        key: this.item.id,
        className: 'fade-in-animation',
        onbeforeremove: ({ dom }: ComponentNode) => {
          dom.classList.add('fade-out-animation');
          return new Promise((resolve) => setTimeout(resolve, getAnimationDuration(dom) * 1e3));
        }
      }, this.edit ? this.renderEditView() : this.renderShowView())
    );
  }

  renderShowView() {
    return (
      div({
        ondblclick: ($event: Event) => {
          this.startEdit();
        }
      }, this.item.title)
    );
  }

  renderEditView() {
    return (
      input({
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

          this.stopEdit();
        }
      })
    );
  }

  startEdit() {
    this.edit = true;
    this.update();
  }

  stopEdit() {
    this.edit = false;
    this.update();
  }
}
