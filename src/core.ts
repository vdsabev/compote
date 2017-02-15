module compote.core {
  export const Mithril: any = (<any>window).m;

  // const virtualDom: typeof VirtualDOM = (<any>window).virtualDom;
  // const { diff, patch, create } = virtualDom;
  //
  // export class App {
  //   render: (app: App) => VirtualDOM.VNode;
  //   container: Element;
  //   tree: VirtualDOM.VNode;
  //   node: Element;
  //
  //   constructor({ render, container }: { render: (app: App) => VirtualDOM.VNode, container: Element }) {
  //     this.render = render;
  //     this.tree = this.render(this);
  //     this.node = create(this.tree);
  //
  //     this.container = container;
  //     this.container.textContent = '';
  //     this.container.appendChild(this.node);
  //   }
  //
  //   update() {
  //     const newTree = this.render(this);
  //     const patches = diff(this.tree, newTree);
  //     const patchedNode = patch(this.node, patches);
  //     this.tree = newTree;
  //     this.node = patchedNode;
  //   }
  // }
}
