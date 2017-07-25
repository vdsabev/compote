import * as m from 'mithril';
import { setHyperscriptFunction } from '../html';
import TodoApp from './todomvc/todo-app';

setHyperscriptFunction(m);
const todoApp = new TodoApp();
