module examples.virtualDom.compote.core {
  const { diff, patch, create } = (<any>window).virtualDom; // TODO: Types

  export class App {
    render: (app: App) => any;
    container: Element;
    tree: any; // TODO: Type
    node: any; // TODO: Type

    constructor({ render, container }: Partial<App>) {
      this.render = render;
      this.tree = this.render(this);
      this.node = create(this.tree);

      this.container = container;
      this.container.textContent = '';
      this.container.appendChild(this.node);
    }

    update() {
      const newTree = this.render(this);
      const patches = diff(this.tree, newTree);
      const patchedNode = patch(this.node, patches);
      this.tree = newTree;
      this.node = patchedNode;
    }
  }
}
