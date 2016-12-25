module compote.app {
  const { $, bind, Component } = core;

  export class AppComponent extends Component {
    @bind name = `World`;

    $render(): core.ComponentTree {
      return [
        `div.app(title="Hello ${this.name}")`, {}, [
          $(`div`, {}, [
            $(`img(alt="${this.name}'s avatar")`),
            $(`span`, {}, [`${this.name} entered the room`])
          ]),
          Label(`span.todo`, { text: `Hello ${this.name}` }),
          Label(`span.todo`, { text: `Goodbye ${this.name}` })
        ]
      ];
    }

    $onInit() {
      // setInterval(() => {
      //   this.name = new Date().toISOString();
      // }, 1e3);
    }
  }

  /** Label */
  export function Label(definition = '', data: core.ComponentData<LabelComponent> = {}) {
    return new LabelComponent(definition, data);
  }

  export class LabelComponent extends Component {
    @bind text: string;

    $render(): core.ComponentTree {
      return [`div`, {}, [this.text]];
    }
  }
}
