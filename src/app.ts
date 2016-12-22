module compote.app {
  const { Component, html, watch } = core;

  export class AppComponent extends Component {
    @watch name: string;

    constructor(data?: Partial<AppComponent>) {
      super(data);
      setInterval(() => {
        this.name = new Date().toISOString();
      }, 1000);
    }

    $render() {
      const { div } = html;
      return div(`Hello ${this.name}`);
    }
  }
}
