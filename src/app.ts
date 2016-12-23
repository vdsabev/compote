module compote.app {
  const { Component, component, watch } = core;

  export class AppComponent extends Component {
    $render() {
      return `<HelloLabel label="World"></HelloLabel>`;
    }
  }

  @component({
    id: 'HelloLabel'
  })
  class HelloLabelComponent extends Component {
    $render() {
      return `<div>Hello ${this.label}</div>`;
    }

    @watch label: string;
    interval = 1e3;

    constructor(data?: Partial<HelloLabelComponent>) {
      super(data);

      setInterval(() => {
        this.label = new Date().toISOString();
      }, this.interval);
    }
  }
}
