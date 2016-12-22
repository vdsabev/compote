/// <reference path="../node_modules/@types/virtual-dom/index.d.ts" />

declare var virtualDom: typeof VirtualDOM;

declare namespace Compote {
  function Component(properties: VirtualDOM.createProperties, children: string | VirtualDOM.VChild[]): VirtualDOM.VNode;
  function Component(children: string | VirtualDOM.VChild[]): VirtualDOM.VNode;
}
