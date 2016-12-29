module compote.app {
  const { Component, HTML, Value, Watch } = core;
  const { div, input, br, img, hr, button, label, span } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({ class: `app`, title: this.name }, [
          input({
            type: `text`,
            value: this.name,
            onInput: ($event: Event) => this.name = (<HTMLInputElement>$event.target).value
          }),
          br(),
          `Text node: ${this.name}`,
          br(),
          img({ alt: `Element attribute: ${this.name}` }),
          div({}, `Element content: ${this.name}`),

          hr(),
          input({
            type: `color`,
            value: this.color,
            onInput: ($event: Event) => this.color = (<HTMLInputElement>$event.target).value
          }),
          Custom({
            class: `a.b.c`,
            style: { color: this.color, padding: '7px 2px 2px 2px' },
            data: {
              text: this.name,
              onChange: (text) => this.name = text
            }
          }),

          hr(),
          button({ type: `button`, onClick: () => this.counter++ }, `Count me in!`),
          ` Button clicked ${this.counter} times`,

          hr(),
          label({ class: `pointer` }, [
            input({
              type: `checkbox`,
              checked: this.checked,
              onChange: ($event?: Event) => this.checked = (<HTMLInputElement>$event.target).checked
            }),
            this.getCheckedText()
          ]),
          div({ if: this.checked }, `Conditional component A`),
          div({ unless: this.checked }, `Conditional component B`),

          // Router
          hr(),
          div({}, [
            button({ onClick: () => this.page = `home` }, `Home Page`),
            button({ onClick: () => this.page = `other` }, `Other Page`)
          ]),

          `Selected Page: `,
          span({ if: this.pageIs(`home`) }, `Home Page`),
          span({ if: this.pageIs(`other`) }, `Other Page`)
        ])
      );
    }

    @Value name = `rendered`;
    @Value color = '#ffffff';
    @Value counter = 0;
    @Value checked = true;
    @Value page = `home`;

    @Watch<AppComponent>('checked')
    @Value getCheckedText() {
      return this.checked ? `Checked` : `Unchecked`;
    }

    @Watch<AppComponent>('page')
    @Value pageIs(page: string) {
      return this.page === page;
    }
  }

  /** Custom */
  // TODO: Support merging definition / children
  export function Custom(attributes?: core.ComponentAttributes<CustomComponent>): core.ComponentTree {
    return [Object.assign({ Component: CustomComponent }, attributes), []];
  }

  export class CustomComponent extends Component {
    $render() {
      return div({}, [
        div({}, `Custom component: send event data`),
        input({
          type: `text`,
          value: this.text,
          onInput: ($event: Event) => this.onChange((<HTMLInputElement>$event.target).value)
        })
      ]);
    }

    @Value text: string;

    onChange: (text: string) => void;
  }
}
