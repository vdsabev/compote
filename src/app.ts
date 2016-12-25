module compote.app {
  const { bind, $, Component } = core;

  export class AppComponent extends Component {
    @bind name = `World`;

    $render(): core.ComponentTree {
      return [`div.app(title="Hello ${this.name}")`, {}, [
        $(`div`, {}, [
          $(`img(alt="${this.name}'s avatar")`),
          $(`span`, {}, [`${this.name} entered the room`])
        ]),
        Label({ text: `Hello ${this.name}` }),
        Label({ text: `Goodbye ${this.name}` })
      ]];
    }

    $onInit() {
      // setInterval(() => {
      //   this.name = new Date().toISOString();
      // }, 1e3);
    }
  }

  /** Label */
  export function Label(data: core.ComponentData<LabelComponent> = {}, children: core.ComponentChild[] = []) {
    return new LabelComponent();
  }

  export class LabelComponent extends Component {
    @bind text: string;

    $render(): core.ComponentTree {
      return [`div`, {}, [this.text]];
    }
  }
}
