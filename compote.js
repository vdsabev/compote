const Mithril = m;
class Component {
    constructor(app, data, ...args) {
        this.app = app;
        this.app = app;
        Object.assign(this, data);
    }
    update() {
        this.app.update();
    }
}

function getAnimationDuration($el) {
    return parseFloat(window.getComputedStyle($el).animationDuration);
}

// http://www.quackit.com/html_5/tags
const a = tag('a');
const abbr = tag('abbr');
const address = tag('address');
const area = tag('area');
const article = tag('article');
const aside = tag('aside');
const audio = tag('audio');
const b = tag('b');
const base = tag('base');
const bdo = tag('bdo');
const blockquote = tag('blockquote');
const body = tag('body');
const br = tag('br');
const button = tag('button');
const canvas = tag('canvas');
const caption = tag('caption');
const cite = tag('cite');
const code = tag('code');
const col = tag('col');
const colgroup = tag('colgroup');
const datalist = tag('datalist');
const dd = tag('dd');
const del = tag('del');
const dfn = tag('dfn');
const div = tag('div');
const dl = tag('dl');
const dt = tag('dt');
const em = tag('em');
const embed = tag('embed');
const fieldset = tag('fieldset');
const figcaption = tag('figcaption');
const figure = tag('figure');
const footer = tag('footer');
const form = tag('form');
const h1 = tag('h1');
const h2 = tag('h2');
const h3 = tag('h3');
const h4 = tag('h4');
const h5 = tag('h5');
const h6 = tag('h6');
const head = tag('head');
const header = tag('header');
const hgroup = tag('hgroup');
const hr = tag('hr');
const html = tag('html');
const i = tag('i');
const iframe = tag('iframe');
const img = tag('img');
const input = tag('input');
const ins = tag('ins');
const kbd = tag('kbd');
const keygen = tag('keygen');
const label = tag('label');
const legend = tag('legend');
const li = tag('li');
const link = tag('link');
const map = tag('map');
const mark = tag('mark');
const menu = tag('menu');
const meta = tag('meta');
const meter = tag('meter');
const nav = tag('nav');
const noscript = tag('noscript');
const object = tag('object');
const ol = tag('ol');
const optgroup = tag('optgroup');
const option = tag('option');
const p = tag('p');
const param = tag('param');
const pre = tag('pre');
const progress = tag('progress');
const q = tag('q');
const rt = tag('rt');
const ruby = tag('ruby');
const s = tag('s');
const samp = tag('samp');
const script = tag('script');
const section = tag('section');
const select = tag('select');
const small = tag('small');
const source = tag('source');
const span = tag('span');
const strong = tag('strong');
const style = tag('style');
const sub = tag('sub');
const sup = tag('sup');
const table = tag('table');
const tbody = tag('tbody');
const td = tag('td');
const template = tag('template');
const textarea = tag('textarea');
const tfoot = tag('tfoot');
const th = tag('th');
const thead = tag('thead');
const title = tag('title');
const tr = tag('tr');
const track = tag('track');
const u = tag('u');
const ul = tag('ul');
const video = tag('video');
const wbr = tag('wbr');
function tag(tagName) {
    return (properties, children) => {
        return Mithril(tagName, properties, children);
    };
}

export { Mithril, Component, getAnimationDuration, a, abbr, address, area, article, aside, audio, b, base, bdo, blockquote, body, br, button, canvas, caption, cite, code, col, colgroup, datalist, dd, del, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html, i, iframe, img, input, ins, kbd, keygen, label, legend, li, link, map, mark, menu, meta, meter, nav, noscript, object, ol, optgroup, option, p, param, pre, progress, q, rt, ruby, s, samp, script, section, select, small, source, span, strong, style, sub, sup, table, tbody, td, template, textarea, tfoot, th, thead, title, tr, track, u, ul, video, wbr, tag };
