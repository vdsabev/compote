module compote.app {
  const { Component, html, watch } = core;

  export function HelloLabel(data: Partial<HelloLabelComponent>) {
    const { div } = html;
    return div({ className: 'hello-label' }, `Hello ${data.name}`);
  }

  export class HelloLabelComponent extends Component {
    @watch name: string;

    constructor(data?: Partial<HelloLabelComponent>) {
      super(data);
      setInterval(() => {
        this.name = new Date().toISOString();
      }, 1e3);
    }
  }

  export class AppComponent extends Component {
    HelloLabelComponent = new HelloLabelComponent({ $parent: this, name: 'World' });

    constructor(data?: Partial<AppComponent>) {
      super(data);
    }

    $render() {
      const { br, div } = html;
      return div({ className: 'app' }, [
        br(''),
        HelloLabel(this.HelloLabelComponent),
        br(''),
        HelloLabel(this.HelloLabelComponent),
        br('')
      ]);
    }
  }
}
