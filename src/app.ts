module compote.app {
  const { Component, component, watch } = core;
  const { h, div } = core.Renderer;

  export class AppComponent extends Component {
    $render() {
      return div({}, [
        HelloLabel({ label: 'World' })
      ]);
    }
  }

  function HelloLabel(attributes: Partial<HelloLabelComponent> = {}, children: core.VirtualTree[] = []) {
    return h('HelloLabel', <any>attributes, children);
  }

  @component({
    id: 'HelloLabel'
  })
  class HelloLabelComponent extends Component {
    $render() {
      return div({}, [`Hello ${this.label}`]);
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
