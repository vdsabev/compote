module compote.examples.todomvc {
  const { Component, HTML, Value } = core;
  const { div, input } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({}, [
          input({
            autofocus: true,
            onKeyUp: ($event: KeyboardEvent) => {
              const value = (<HTMLInputElement>$event.target).value;
              if ($event.which === 13 && value) {
                this.items.push(value);
              }
            }
          }),
          ...this.items.map((item) => div({ $map: this.items }))
        ])
      );
    }

    @Value items: string[] = [];
  }
}
