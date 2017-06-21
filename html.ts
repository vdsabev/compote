import * as m from 'mithril';

export const Compote = m;

/** HTML */
// http://www.quackit.com/html_5/tags
export const a = tag('a');
export const abbr = tag('abbr');
export const acronym = tag('acronym');
export const address = tag('address');
export const applet = tag('applet');
export const area = tag('area');
export const article = tag('article');
export const aside = tag('aside');
export const audio = tag('audio');
export const b = tag('b');
export const base = tag('base');
export const basefont = tag('basefont');
export const bdo = tag('bdo');
export const big = tag('big');
export const blockquote = tag('blockquote');
export const body = tag('body');
export const br = tag('br');
export const button = tag('button');
export const canvas = tag('canvas');
export const caption = tag('caption');
export const center = tag('center');
export const circle = tag('circle');
export const cite = tag('cite');
export const clippath = tag('clippath');
export const code = tag('code');
export const col = tag('col');
export const colgroup = tag('colgroup');
// export const data = tag('data');
export const datalist = tag('datalist');
export const dd = tag('dd');
export const defs = tag('defs');
export const del = tag('del');
export const desc = tag('desc');
export const dfn = tag('dfn');
export const dir = tag('dir');
export const div = tag('div');
export const dl = tag('dl');
export const dt = tag('dt');
export const ellipse = tag('ellipse');
export const em = tag('em');
export const embed = tag('embed');
export const feblend = tag('feblend');
export const fecolormatrix = tag('fecolormatrix');
export const fecomponenttransfer = tag('fecomponenttransfer');
export const fecomposite = tag('fecomposite');
export const feconvolvematrix = tag('feconvolvematrix');
export const fediffuselighting = tag('fediffuselighting');
export const fedisplacementmap = tag('fedisplacementmap');
export const fedistantlight = tag('fedistantlight');
export const feflood = tag('feflood');
export const fefunca = tag('fefunca');
export const fefuncb = tag('fefuncb');
export const fefuncg = tag('fefuncg');
export const fefuncr = tag('fefuncr');
export const fegaussianblur = tag('fegaussianblur');
export const feimage = tag('feimage');
export const femerge = tag('femerge');
export const femergenode = tag('femergenode');
export const femorphology = tag('femorphology');
export const feoffset = tag('feoffset');
export const fepointlight = tag('fepointlight');
export const fespecularlighting = tag('fespecularlighting');
export const fespotlight = tag('fespotlight');
export const fetile = tag('fetile');
export const feturbulence = tag('feturbulence');
export const fieldset = tag('fieldset');
export const figcaption = tag('figcaption');
export const figure = tag('figure');
export const filter = tag('filter');
export const font = tag('font');
export const footer = tag('footer');
export const foreignobject = tag('foreignobject');
export const form = tag('form');
export const frame = tag('frame');
export const frameset = tag('frameset');
export const g = tag('g');
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
export const image = tag('image');
export const img = tag('img');
export const input = tag('input');
export const ins = tag('ins');
export const isindex = tag('isindex');
export const kbd = tag('kbd');
export const keygen = tag('keygen');
export const label = tag('label');
export const legend = tag('legend');
export const li = tag('li');
export const line = tag('line');
export const lineargradient = tag('lineargradient');
export const link = tag('link');
export const listing = tag('listing');
export const map = tag('map');
export const mark = tag('mark');
export const marker = tag('marker');
export const marquee = tag('marquee');
export const mask = tag('mask');
export const menu = tag('menu');
export const meta = tag('meta');
export const metadata = tag('metadata');
export const meter = tag('meter');
export const nav = tag('nav');
export const nextid = tag('nextid');
export const nobr = tag('nobr');
export const noframes = tag('noframes');
export const noscript = tag('noscript');
export const object = tag('object');
export const ol = tag('ol');
export const optgroup = tag('optgroup');
export const option = tag('option');
// export const output = tag('output');
export const p = tag('p');
export const param = tag('param');
export const path = tag('path');
export const pattern = tag('pattern');
export const picture = tag('picture');
export const plaintext = tag('plaintext');
export const polygon = tag('polygon');
export const polyline = tag('polyline');
export const pre = tag('pre');
export const progress = tag('progress');
export const q = tag('q');
export const radialgradient = tag('radialgradient');
export const rect = tag('rect');
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
export const stop = tag('stop');
export const strike = tag('strike');
export const strong = tag('strong');
export const style = tag('style');
export const sub = tag('sub');
export const sup = tag('sup');
export const svg = tag('svg');
// export const switch = tag('switch');
export const symbol = tag('symbol');
export const table = tag('table');
export const tbody = tag('tbody');
export const td = tag('td');
export const template = tag('template');
export const text = tag('text');
export const textpath = tag('textpath');
export const textarea = tag('textarea');
export const tfoot = tag('tfoot');
export const th = tag('th');
export const thead = tag('thead');
// export const time = tag('time');
export const title = tag('title');
export const tr = tag('tr');
export const track = tag('track');
export const tspan = tag('tspan');
export const tt = tag('tt');
export const u = tag('u');
export const ul = tag('ul');
export const use = tag('use');
// export const var = tag('var');
export const video = tag('video');
export const view = tag('view');
export const wbr = tag('wbr');
// export const x-ms-webview = tag('webview');
export const xmp = tag('xmp');

export function tag<TagNameType extends keyof ElementTagNameMap, ElementType extends ElementTagNameMap[TagNameType]>(tagName: TagNameType) {
  return function (properties?: CustomProperties & RecursivePartial<ElementType>, children?: m.Children) {
    return Compote(tagName, properties, children);
  };
}

export type Properties<ElementType> = CustomProperties & RecursivePartial<ElementType>;

export type CustomProperties = {
  key?: number | string;

  oninit?(node?: ComponentNode): void;
  oncreate?(node?: ComponentNode): void;

  onbeforeupdate?(newNode?: ComponentNode, oldNode?: ComponentNode): void | boolean;
  onupdate?(node?: ComponentNode): void;

  onbeforeremove?(node?: ComponentNode): void | Promise<any>;
  onremove?(node?: ComponentNode): void;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type ComponentNode = m.Vnode<any, any> & { dom: HTMLElement };
