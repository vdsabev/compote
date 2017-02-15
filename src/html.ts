module compote.html {
  import m = compote.core.Mithril;

  /** HTML tags */
  // http://www.quackit.com/html_5/tags
  export const HTML = {
    a: tag('a'),
    abbr: tag('abbr'),
    address: tag('address'),
    area: tag('area'),
    article: tag('article'),
    aside: tag('aside'),
    audio: tag('audio'),
    b: tag('b'),
    base: tag('base'),
    bdo: tag('bdo'),
    blockquote: tag('blockquote'),
    body: tag('body'),
    br: tag('br'),
    button: tag('button'),
    canvas: tag('canvas'),
    caption: tag('caption'),
    cite: tag('cite'),
    code: tag('code'),
    col: tag('col'),
    colgroup: tag('colgroup'),
    datalist: tag('datalist'),
    dd: tag('dd'),
    del: tag('del'),
    dfn: tag('dfn'),
    div: tag('div'),
    dl: tag('dl'),
    dt: tag('dt'),
    em: tag('em'),
    embed: tag('embed'),
    fieldset: tag('fieldset'),
    figcaption: tag('figcaption'),
    figure: tag('figure'),
    footer: tag('footer'),
    form: tag('form'),
    h1: tag('h1'),
    h2: tag('h2'),
    h3: tag('h3'),
    h4: tag('h4'),
    h5: tag('h5'),
    h6: tag('h6'),
    head: tag('head'),
    header: tag('header'),
    hgroup: tag('hgroup'),
    hr: tag('hr'),
    html: tag('html'),
    i: tag('i'),
    iframe: tag('iframe'),
    img: tag('img'),
    input: tag('input'),
    ins: tag('ins'),
    kbd: tag('kbd'),
    keygen: tag('keygen'),
    label: tag('label'),
    legend: tag('legend'),
    li: tag('li'),
    link: tag('link'),
    map: tag('map'),
    mark: tag('mark'),
    menu: tag('menu'),
    meta: tag('meta'),
    meter: tag('meter'),
    nav: tag('nav'),
    noscript: tag('noscript'),
    object: tag('object'),
    ol: tag('ol'),
    optgroup: tag('optgroup'),
    option: tag('option'),
    p: tag('p'),
    param: tag('param'),
    pre: tag('pre'),
    progress: tag('progress'),
    q: tag('q'),
    rt: tag('rt'),
    ruby: tag('ruby'),
    s: tag('s'),
    samp: tag('samp'),
    script: tag('script'),
    section: tag('section'),
    select: tag('select'),
    small: tag('small'),
    source: tag('source'),
    span: tag('span'),
    strong: tag('strong'),
    style: tag('style'),
    sub: tag('sub'),
    sup: tag('sup'),
    table: tag('table'),
    tbody: tag('tbody'),
    td: tag('td'),
    template: tag('template'),
    textarea: tag('textarea'),
    tfoot: tag('tfoot'),
    th: tag('th'),
    thead: tag('thead'),
    title: tag('title'),
    tr: tag('tr'),
    track: tag('track'),
    u: tag('u'),
    ul: tag('ul'),
    var: tag('var'),
    video: tag('video'),
    wbr: tag('wbr')
  };

  export function tag<TagNameType extends keyof ElementTagNameMap, ElementType extends ElementTagNameMap[TagNameType]>(tagName: TagNameType) {
    return (properties?: RecursivePartial<ElementType>, children?: any) => {
      return m(tagName, properties, children);
    };
  }

  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  };
}
