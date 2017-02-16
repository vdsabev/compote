/// <reference path="../node_modules/@types/mithril/index.d.ts" />

type CustomProperties = {
  key?: number | string;

  oninit?(node?: ComponentNode): void;
  oncreate?(node?: ComponentNode): void;

  onbeforeupdate?(newNode?: ComponentNode, oldNode?: ComponentNode): void | boolean;
  onupdate?(node?: ComponentNode): void;

  onbeforeremove?(node?: ComponentNode): void | Promise<any>;
  onremove?(node?: ComponentNode): void;
};

type ComponentNode = Mithril.VirtualElement & { dom: HTMLElement };

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
