module examples.todomvc {
  export class Todo {
    static id = 0;

    id: number;
    completed: boolean;

    constructor(public title: string) {
      this.id = Todo.id;
      Todo.id++;
    }
  }
}
