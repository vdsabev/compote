/// <reference types="mithril" />
import { Component } from '../../src/core';
import Todo from './todo';
export default class TodoItem extends Component<TodoItem> {
    item: Todo;
    edit: boolean;
    onDelete: (item: TodoItem) => void;
    render(): Mithril.VirtualElement;
    renderShowView(): Mithril.VirtualElement;
    renderEditView(): Mithril.VirtualElement;
    startEdit(): void;
    stopEdit(): void;
}
