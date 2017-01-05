/// <reference path="../../node_modules/@types/rx/index.d.ts" />

module compote.examples.rxjs {
  export const Compote: Record<string, any> = {};

  const button = tag('button');
  const span = tag('span');

  const count = new Rx.BehaviorSubject(0);
  Compote['count'] = count;

  const $button = button({ onclick: () => count.next(count.getValue() + 1) }, `Click me`);

  const $span = span(`Clicked {{count}} times`);

  const $container = document.getElementById('container');
  removeAllChildrenOf($container);
  $container.appendChild($button);
  $container.appendChild($span);

  function tag<TagNameType extends keyof HTMLElementTagNameMap>(tagName: TagNameType) {
    return (properties: string | Partial<HTMLElement>, content?: string) => {
      if (typeof properties === 'string') {
        properties = { textContent: properties };
      }
      else {
        if (content) {
          if (!properties) {
            properties = {};
          }

          properties.textContent = content;
        }
      }

      const $el = document.createElement<TagNameType>(tagName);
      Object.assign($el, properties);

      for (let propertyKey in properties) {
        if (properties.hasOwnProperty(propertyKey)) {
          const propertyValue = (<any>properties)[propertyKey];
          const matches = propertyValue && propertyValue.toString().match(/{{(\w+)}}/);
          if (matches && matches.length > 0) {
            (<any>$el).dataset[propertyKey] = propertyValue;

            const observableKey = matches[1];
            const observable = Compote[observableKey];
            observable.subscribe((value: any) => {
              (<any>$el)[propertyKey] = propertyValue.replace(/{{\w+}}/, value);
            });
          }
        }
      }

      return $el;
    };
  }

  // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  function removeAllChildrenOf($el: HTMLElement) {
    while ($el.firstChild) {
      $el.removeChild($el.lastChild);
    }
  }
}
