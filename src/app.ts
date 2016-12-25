module compote.app {
  const { bind, HTML, Component } = core;
  const { div } = HTML;

  export class AppComponent extends Component {
    @bind name = 'World';

    $render(): core.ComponentTree {
      return [`.app(title="Hello ${this.name}")`, {}, [
        div({}, [`${this.name} entered the room`]),
        Label({ data: { text: `Hello ${this.name}` } }),
        Label({ data: { text: `Goodbye ${this.name}` } })
      ]];
    }

    $onInit() {
      // setInterval(() => {
      //   this.name = new Date().toISOString();
      // }, 1e3);
    }
  }

  // /** HelloInput */
  // const HelloInput = component(HelloInputComponent);

  // class HelloInputComponent extends Component {
  //   @bind value: string;
  //
  //   $render() {
  //     return [`input(type="text" value="${this.value}")`];
  //   }
  // }

  /** Label */
  export function Label(properties: core.ComponentProperties<LabelComponent> = {}, children: core.ComponentChild[] = []) {
    return new LabelComponent();
  }

  export class LabelComponent extends Component {
    @bind text: string;

    $render(): core.ComponentTree {
      return [`div`, {}, [this.text]];
    }
  }
}
