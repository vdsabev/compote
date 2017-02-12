module examples.virtualDom.compote.html {
  // TODO: Types
  const { h } = (<any>window).virtualDom;

  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  };

  export const button = tag('button');
  export const div = tag('div');
  export const h1 = tag('h1');
  export const input = tag('input');

  export function tag<TagNameType extends keyof HTMLElementTagNameMap, HTMLElementType extends HTMLElementTagNameMap[TagNameType]>(tagName: TagNameType) {
    return (properties?: RecursivePartial<HTMLElementType>, children?: any) => {
      return h(tagName, properties, children);
    };
  }
}
