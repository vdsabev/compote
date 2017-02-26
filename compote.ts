import * as m from 'mithril';
export const Compote = m;

/** CSS */
export function getAnimationDuration($el: HTMLElement) {
  return parseFloat(window.getComputedStyle($el).animationDuration);
}

/** HTML */
// http://www.quackit.com/html_5/tags
export const a = tag('a');
export const abbr = tag('abbr');
export const address = tag('address');
export const area = tag('area');
export const article = tag('article');
export const aside = tag('aside');
export const audio = tag('audio');
export const b = tag('b');
export const base = tag('base');
export const bdo = tag('bdo');
export const blockquote = tag('blockquote');
export const body = tag('body');
export const br = tag('br');
export const button = tag('button');
export const canvas = tag('canvas');
export const caption = tag('caption');
export const cite = tag('cite');
export const code = tag('code');
export const col = tag('col');
export const colgroup = tag('colgroup');
export const datalist = tag('datalist');
export const dd = tag('dd');
export const del = tag('del');
export const dfn = tag('dfn');
export const div = tag('div');
export const dl = tag('dl');
export const dt = tag('dt');
export const em = tag('em');
export const embed = tag('embed');
export const fieldset = tag('fieldset');
export const figcaption = tag('figcaption');
export const figure = tag('figure');
export const footer = tag('footer');
export const form = tag('form');
export const h1 = tag('h1');
export const h2 = tag('h2');
export const h3 = tag('h3');
export const h4 = tag('h4');
export const h5 = tag('h5');
export const h6 = tag('h6');
export const head = tag('head');
export const header = tag('header');
export const hgroup = tag('hgroup');
export const hr = tag('hr');
export const html = tag('html');
export const i = tag('i');
export const iframe = tag('iframe');
export const img = tag('img');
export const input = tag('input');
export const ins = tag('ins');
export const kbd = tag('kbd');
export const keygen = tag('keygen');
export const label = tag('label');
export const legend = tag('legend');
export const li = tag('li');
export const link = tag('link');
export const map = tag('map');
export const mark = tag('mark');
export const menu = tag('menu');
export const meta = tag('meta');
export const meter = tag('meter');
export const nav = tag('nav');
export const noscript = tag('noscript');
export const object = tag('object');
export const ol = tag('ol');
export const optgroup = tag('optgroup');
export const option = tag('option');
export const p = tag('p');
export const param = tag('param');
export const pre = tag('pre');
export const progress = tag('progress');
export const q = tag('q');
export const rt = tag('rt');
export const ruby = tag('ruby');
export const s = tag('s');
export const samp = tag('samp');
export const script = tag('script');
export const section = tag('section');
export const select = tag('select');
export const small = tag('small');
export const source = tag('source');
export const span = tag('span');
export const strong = tag('strong');
export const style = tag('style');
export const sub = tag('sub');
export const sup = tag('sup');
export const table = tag('table');
export const tbody = tag('tbody');
export const td = tag('td');
export const template = tag('template');
export const textarea = tag('textarea');
export const tfoot = tag('tfoot');
export const th = tag('th');
export const thead = tag('thead');
export const title = tag('title');
export const tr = tag('tr');
export const track = tag('track');
export const u = tag('u');
export const ul = tag('ul');
export const video = tag('video');
export const wbr = tag('wbr');

export function tag<TagNameType extends keyof ElementTagNameMap, ElementType extends ElementTagNameMap[TagNameType]>(tagName: TagNameType) {
  return (properties?: CustomProperties & RecursivePartial<ElementType>, children?: Mithril.Children) => {
    return Compote(tagName, properties, children);
  };
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

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
