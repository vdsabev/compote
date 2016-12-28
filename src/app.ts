module compote.app {
  const { Component, HTML, Value, Event } = core;
  const { div, input, br, img, hr, button, label, span } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({ class: `app`, title: this.name }, [
          input({ type: `text`, value: this.name, onInput: this.setName(event) }),
          br(),
          `Text node: ${this.name}`,
          br(),
          img({ alt: `Element attribute: ${this.name}` }),
          div({}, `Element content: ${this.name}`),

          hr(),
          input({ type: `color`, value: this.background, onInput: this.setBackground(event) }),
          Label({
            class: `a.b.c`,
            style: { background: this.background },
            data: { text: `Custom component: input data` }
          }),

          hr(),
          button({ type: `button`, onClick: this.incrementCounter() }, `Count me in!`),
          ` Button clicked ${this.counter} times`,

          hr(),
          label({ class: `pointer` }, [
            input({ type: `checkbox`, checked: this.checked, onChange: this.toggleChecked(event) }),
            this.getCheckedText()
          ]),
          div({ if: this.checked }, `Conditional component A`),
          div({ unless: this.checked }, `Conditional component B`),

          // Router
          hr(),
          div({}, [
            button({ onClick: this.setPage(`home`) }, `Home Page`),
            button({ onClick: this.setPage(`other`) }, `Other Page`)
          ]),

          `Selected Page: `,
          span({ if: this.pageIs(`home`) }, `Home Page`),
          span({ if: this.pageIs(`other`) }, `Other Page`)
        ])
      );
    }

    @Value name = `rendered`;
    @Event setName($event?: Event) {
      this.name = (<HTMLInputElement>$event.target).value;
    }

    @Value background: string;
    @Event setBackground($event?: Event) {
      this.background = (<HTMLInputElement>$event.target).value;
    }

    @Value counter = 0;
    @Event incrementCounter() {
      this.counter++;
    }

    @Value checked = true;
    @Value getCheckedText() {
      return this.checked ? `Checked` : `Unchecked`;
    }
    @Event toggleChecked($event?: Event) {
      this.checked = !this.checked;
    }

    @Value page = `home`;
    @Value pageIs(page: string) {
      return this.page === page;
    }
    @Event setPage(page: string) {
      this.page = page;
    }
  }

  /** Label */
  // TODO: Support merging definition / children
  export function Label(attributes?: core.ComponentAttributes<LabelComponent>): core.ComponentTree {
    return [Object.assign({ Component: LabelComponent }, attributes), []];
  }

  export class LabelComponent extends Component {
    $render() {
      return div({}, this.text);
    }

    @Value text: string;
  }
}
