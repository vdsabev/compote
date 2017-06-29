"use strict";
exports.__esModule = true;
var m = require("mithril");
exports.Compote = m;
/** HTML */
// http://www.quackit.com/html_5/tags
exports.a = tag('a');
exports.abbr = tag('abbr');
exports.acronym = tag('acronym');
exports.address = tag('address');
exports.applet = tag('applet');
exports.area = tag('area');
exports.article = tag('article');
exports.aside = tag('aside');
exports.audio = tag('audio');
exports.b = tag('b');
exports.base = tag('base');
exports.basefont = tag('basefont');
exports.bdo = tag('bdo');
exports.big = tag('big');
exports.blockquote = tag('blockquote');
exports.body = tag('body');
exports.br = tag('br');
exports.button = tag('button');
exports.canvas = tag('canvas');
exports.caption = tag('caption');
exports.center = tag('center');
exports.circle = tag('circle');
exports.cite = tag('cite');
exports.clippath = tag('clippath');
exports.code = tag('code');
exports.col = tag('col');
exports.colgroup = tag('colgroup');
// export const data = tag('data');
exports.datalist = tag('datalist');
exports.dd = tag('dd');
exports.defs = tag('defs');
exports.del = tag('del');
exports.desc = tag('desc');
exports.dfn = tag('dfn');
exports.dir = tag('dir');
exports.div = tag('div');
exports.dl = tag('dl');
exports.dt = tag('dt');
exports.ellipse = tag('ellipse');
exports.em = tag('em');
exports.embed = tag('embed');
exports.feblend = tag('feblend');
exports.fecolormatrix = tag('fecolormatrix');
exports.fecomponenttransfer = tag('fecomponenttransfer');
exports.fecomposite = tag('fecomposite');
exports.feconvolvematrix = tag('feconvolvematrix');
exports.fediffuselighting = tag('fediffuselighting');
exports.fedisplacementmap = tag('fedisplacementmap');
exports.fedistantlight = tag('fedistantlight');
exports.feflood = tag('feflood');
exports.fefunca = tag('fefunca');
exports.fefuncb = tag('fefuncb');
exports.fefuncg = tag('fefuncg');
exports.fefuncr = tag('fefuncr');
exports.fegaussianblur = tag('fegaussianblur');
exports.feimage = tag('feimage');
exports.femerge = tag('femerge');
exports.femergenode = tag('femergenode');
exports.femorphology = tag('femorphology');
exports.feoffset = tag('feoffset');
exports.fepointlight = tag('fepointlight');
exports.fespecularlighting = tag('fespecularlighting');
exports.fespotlight = tag('fespotlight');
exports.fetile = tag('fetile');
exports.feturbulence = tag('feturbulence');
exports.fieldset = tag('fieldset');
exports.figcaption = tag('figcaption');
exports.figure = tag('figure');
exports.filter = tag('filter');
exports.font = tag('font');
exports.footer = tag('footer');
exports.foreignobject = tag('foreignobject');
exports.form = tag('form');
exports.frame = tag('frame');
exports.frameset = tag('frameset');
exports.g = tag('g');
exports.h1 = tag('h1');
exports.h2 = tag('h2');
exports.h3 = tag('h3');
exports.h4 = tag('h4');
exports.h5 = tag('h5');
exports.h6 = tag('h6');
exports.head = tag('head');
exports.header = tag('header');
exports.hgroup = tag('hgroup');
exports.hr = tag('hr');
exports.html = tag('html');
exports.i = tag('i');
exports.iframe = tag('iframe');
exports.image = tag('image');
exports.img = tag('img');
exports.input = tag('input');
exports.ins = tag('ins');
exports.isindex = tag('isindex');
exports.kbd = tag('kbd');
exports.keygen = tag('keygen');
exports.label = tag('label');
exports.legend = tag('legend');
exports.li = tag('li');
exports.line = tag('line');
exports.lineargradient = tag('lineargradient');
exports.link = tag('link');
exports.listing = tag('listing');
exports.map = tag('map');
exports.mark = tag('mark');
exports.marker = tag('marker');
exports.marquee = tag('marquee');
exports.mask = tag('mask');
exports.menu = tag('menu');
exports.meta = tag('meta');
exports.metadata = tag('metadata');
exports.meter = tag('meter');
exports.nav = tag('nav');
exports.nextid = tag('nextid');
exports.nobr = tag('nobr');
exports.noframes = tag('noframes');
exports.noscript = tag('noscript');
exports.object = tag('object');
exports.ol = tag('ol');
exports.optgroup = tag('optgroup');
exports.option = tag('option');
// export const output = tag('output');
exports.p = tag('p');
exports.param = tag('param');
exports.path = tag('path');
exports.pattern = tag('pattern');
exports.picture = tag('picture');
exports.plaintext = tag('plaintext');
exports.polygon = tag('polygon');
exports.polyline = tag('polyline');
exports.pre = tag('pre');
exports.progress = tag('progress');
exports.q = tag('q');
exports.radialgradient = tag('radialgradient');
exports.rect = tag('rect');
exports.rt = tag('rt');
exports.ruby = tag('ruby');
exports.s = tag('s');
exports.samp = tag('samp');
exports.script = tag('script');
exports.section = tag('section');
exports.select = tag('select');
exports.small = tag('small');
exports.source = tag('source');
exports.span = tag('span');
exports.stop = tag('stop');
exports.strike = tag('strike');
exports.strong = tag('strong');
exports.style = tag('style');
exports.sub = tag('sub');
exports.sup = tag('sup');
exports.svg = tag('svg');
// export const switch = tag('switch');
exports.symbol = tag('symbol');
exports.table = tag('table');
exports.tbody = tag('tbody');
exports.td = tag('td');
exports.template = tag('template');
exports.text = tag('text');
exports.textpath = tag('textpath');
exports.textarea = tag('textarea');
exports.tfoot = tag('tfoot');
exports.th = tag('th');
exports.thead = tag('thead');
// export const time = tag('time');
exports.title = tag('title');
exports.tr = tag('tr');
exports.track = tag('track');
exports.tspan = tag('tspan');
exports.tt = tag('tt');
exports.u = tag('u');
exports.ul = tag('ul');
exports.use = tag('use');
// export const var = tag('var');
exports.video = tag('video');
exports.view = tag('view');
exports.wbr = tag('wbr');
// export const x-ms-webview = tag('webview');
exports.xmp = tag('xmp');
function tag(tagName) {
    return function (properties) {
        var children = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            children[_i - 1] = arguments[_i];
        }
        return exports.Compote.apply(void 0, [tagName, properties].concat(children));
    };
}
exports.tag = tag;
