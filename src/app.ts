module compote.app {
  const { Component, bind } = core;
  const { div } = core.Renderer;

  export class AppComponent extends Component {
    @bind helloTo = 'World';

    constructor() {
      super();

      setInterval(() => {
        this.helloTo = new Date().toISOString();
      }, 1e3);
    }

    $render() {
      return div({}, [
        div({}, [`Hello ${this.helloTo}`])
      ]);
    }
  }

  // /** HelloInput */
  // const HelloInput = tag('HelloInput');
  //
  // @component({
  //   id: 'HelloInput'
  // })
  // class HelloInputComponent extends Component {
  //   $render() {
  //     return input({ type: 'text', value: this.value });
  //   }
  //
  //   @bind value: string;
  // }

  // /** HelloLabel */
  // const HelloLabel = tag('HelloLabel');
  //
  // @component({
  //   id: 'HelloLabel'
  // })
  // class HelloLabelComponent extends Component {
  //   $render() {
  //     return div({ innerHTML: `Hello ${this.label}` });
  //   }
  //
  //   @bind label: string;
  // }
}
