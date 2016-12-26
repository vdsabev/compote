module compote.app {
  const { HTML, bind, Component } = core;
  const { div, input, br, img, hr, button } = HTML;

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
          // TODO: Support merging definition / children
          Label({ class: 'todo', data: { text: `Custom component: ${this.name}` } }),

          hr(),
          button({ type: 'button', onClick: this.incrementCounter() }, `Count me in!`),
          ` Button clicked ${this.counter} times`
        ])
      );
    }

    @bind name = `Alice`;
    @bind counter = 0;

    @bind
    setName($event?: Event) {
      this.name = (<HTMLInputElement>$event.target).value;
    }

    @bind
    incrementCounter() {
      this.counter++;
    }
  }

  /** Label */
  export function Label(attributes?: core.ComponentAttributes<LabelComponent>): core.ComponentTree {
    return [Object.assign({ Component: LabelComponent }, attributes), []];
  }

  export class LabelComponent extends Component {
    $render(): core.ComponentTree {
      return div({}, this.text);
    }

    @bind text: string;
  }
}
