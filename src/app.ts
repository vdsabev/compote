module compote.app {
  const { Component, HTML, Value, Watch } = core;
  const { div, input, br, img, hr, button, label } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({ class: `app` }, [
          // Router
          div({}, [
            button({ onClick: () => this.page = `home` }, `Home`),
            button({ onClick: () => this.page = `examples` }, `Examples`)
          ]),

          HomePage({ if: this.pageIs(`home`), data: { level: 0 } }),
          ExamplesPage({ if: this.pageIs(`examples`) })
        ])
      );
    }

    @Value page = `examples`;

    @Watch<AppComponent>('page')
    @Value pageIs(page: string) {
      return this.page === page;
    }
  }

  /** HomePage */
  // TODO: Support merging definition / children
  export function HomePage(attributes?: core.ComponentAttributes<HomePageComponent>): core.ComponentTree {
    return [Object.assign({ Component: HomePageComponent }, attributes), []];
  }

  export class HomePageComponent extends Component {
    $render() {
      const children = [];
      if (this.level < 3) {
        children.push(HomePage({ data: { level: this.level + 1 } }));
        children.push(HomePage({ data: { level: this.level + 1 } }));
        children.push(HomePage({ data: { level: this.level + 1 } }));
      }

      return div({}, children);
    }

    level: number;
  }

  /** ExamplesPage */
  // TODO: Support merging definition / children
  export function ExamplesPage(attributes?: core.ComponentAttributes<ExamplesPageComponent>): core.ComponentTree {
    return [Object.assign({ Component: ExamplesPageComponent }, attributes), []];
  }

  export class ExamplesPageComponent extends Component {
    $render() {
      return div({ title: this.name }, [
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
        div({ unless: this.checked }, `Conditional component B`)
      ]);
    }

    @Value name = `rendered`;
    @Value color = '#ffffff';
    @Value counter = 0;
    @Value checked = true;

    @Watch<ExamplesPageComponent>('checked')
    @Value getCheckedText() {
      return this.checked ? `Checked` : `Unchecked`;
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
