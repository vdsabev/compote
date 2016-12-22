module compote.app {
  const { Component } = core;

  export class App extends Component {
    renderer: core.Renderer;
    name: string;

    constructor(data: Partial<App>) {
      super(data);
      setInterval(() => {
        this.name = new Date().toISOString();
        this.update();
      }, 1000);
    }

    render() {
      const { div } = this.renderer;
      return div(`Hello ${this.name}`);
    }
  }
}
