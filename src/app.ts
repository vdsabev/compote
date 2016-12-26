module compote.app {
  const { $, bind, Component } = core;

  /** App */
  export class AppComponent extends Component {
    $render(): core.ComponentTree {
      return [
        `div.app(title="${this.name}")`, {}, [
          $(`input(type="text" value="${this.name}" onInput="${this.setName()}")`),
          $(`br`),
          `Text node: ${this.name}`,
          $(`br`),
          $(`img(alt="Element attribute: ${this.name}")`),
          $(`div`, {}, [`Element content: ${this.name}`]),
          // TODO: Support merging definition / children
          Label(`span.todo`, { text: `Custom component: ${this.name}` }),

          $(`hr`),
          $(`button(type="button" onClick="${this.incrementCounter()}")`, {}, [`Count me in!`]),
          ` Button clicked ${this.counter} times`
        ]
      ];
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
  export function Label(definition = ``, data: core.ComponentData<LabelComponent> = {}) {
    return new LabelComponent(definition, data);
  }

  export class LabelComponent extends Component {
    $render(): core.ComponentTree {
      return [`div`, {}, [this.text]];
    }

    @bind text: string;
  }
}
