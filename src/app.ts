module compote.app {
  const { $, bind, Component } = core;

  export class AppComponent extends Component {
    @bind name = `World`;

    $render(): core.ComponentTree {
      return [
        `div.app(title="Hello ${this.name}")`, {}, [
          `> Text node: ${this.name}`,
          $(`br`),
          $(`img(alt="Element attribute: ${this.name}")`),
          $(`div`, {}, [`Element content: ${this.name}`]),
          Label(`span.todo`, { text: `Custom component 1: ${this.name}` }),
          Label(`span.todo`, { text: `Custom component 2: ${this.name}` })
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
  export function Label(definition = ``, data: core.ComponentData<LabelComponent> = {}) {
    return new LabelComponent(definition, data);
  }

  export class LabelComponent extends Component {
    @bind text: string;

    $render(): core.ComponentTree {
      return [`div`, {}, [this.text]];
    }
  }
}
