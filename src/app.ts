module compote.app {
  const { HTML, bind, Component } = core;
  const { div, input, br, img, hr, button, label } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({ class: `app`, title: this.name }, [
          input({ type: `text`, value: this.name, onInput: this.setName() }),
          br(),
          `Text node: ${this.name}`,
          br(),
          img({ alt: `Element attribute: ${this.name}` }),
          div({}, `Element content: ${this.name}`),

          hr(),
          input({ type: `color`, value: this.background, onInput: this.setBackground() }),
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
            input({ type: `checkbox`, checked: this.checked, onChange: this.toggleChecked() }),
            this.getCheckedText()
          ]),
          div({ if: `${this.checked}` }, `Conditional component A`),
          div({ unless: `${this.checked}` }, `Conditional component B`)
        ])
      );
    }

    @bind('get') name = `rendered`;
    @bind('set') setName($event?: Event) {
      this.name = (<HTMLInputElement>$event.target).value;
    }

    @bind('get') background: string;
    @bind('set') setBackground($event?: Event) {
      this.background = (<HTMLInputElement>$event.target).value;
    }

    @bind('get') counter = 0;
    @bind('set') incrementCounter() {
      this.counter++;
    }

    @bind('get') checked = true;
    @bind('get') getCheckedText() {
      return this.checked ? 'Checked' : 'Unchecked';
    }
    @bind('set') toggleChecked($event?: Event) {
      this.checked = !this.checked;
    }
  }

  /** Label */
  // TODO: Support merging definition / children
  export function Label(attributes?: core.ComponentAttributes<LabelComponent>): core.ComponentTree {
    return [Object.assign({ Component: LabelComponent }, attributes), []];
  }

  export class LabelComponent extends Component {
    $render(): core.ComponentTree {
      return div({}, this.text);
    }

    @bind('get') text: string;
  }
}
