module compote.app {
  const { Component, component, watch } = core;

  class AppComponent extends Component {
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

  bootstrap();

  function bootstrap() {
    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    const container = document.getElementById('container');
    while (container.firstChild) {
      container.removeChild(container.lastChild);
    }

    const app = new AppComponent();
    container.appendChild(app.$el);
  }
}
