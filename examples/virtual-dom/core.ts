module examples.virtualDom.compote.core {
  // TODO: Types
  const { diff, patch, create } = (<any>window).virtualDom;

  export abstract class Component {
    static mount(component: Component, $container: Element) {
      setTimeout(() => {
        $container.textContent = '';
        $container.appendChild(component.node);
      }, 0);
    }

    tree: any; // TODO: Type
    node: any; // TODO: Type

    constructor(data?: Partial<Component>) {
      Object.assign(this, data);

      setTimeout(() => {
        if (!this.tree) {
          this.tree = this.render();
        }

        if (!this.node) {
          this.node = create(this.tree);
        }
      }, 0);
    }

    abstract render(): any; // TODO: Type

    update() {
      const newTree = this.render();
      const patches = diff(this.tree, newTree);
      const patchedNode = patch(this.node, patches);
      this.tree = newTree;
      this.node = patchedNode;
    }
  }
}
