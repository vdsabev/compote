/// <reference types="mithril" />
import { App } from '../../compote';
import TodoItem from './todo-item';
export default class TodoApp implements App {
    constructor();
    items: TodoItem[];
    update(): void;
    render(): Mithril.VirtualElement[];
    addItem(title: string): void;
}
