module compote.app {
  const { Component, HTML, Value, Watch } = core;
  const { div, input, br, img, hr, button, label } = HTML;

  /** App */
  export class AppComponent extends Component {
    $render() {
      return (
        div({}, [
          // // Router
          // div({}, [
          //   button({ onClick: () => this.page = `home` }, `Home`),
          //   button({ onClick: () => this.page = `examples` }, `Examples`)
          // ]),
          //
          // HomePage({ if: this.pageIs(`home`), data: { level: 1 } }),
          ExamplesPage(/*{ if: this.pageIs(`examples`) }*/)
        ])
      );
    }

    // @Value page = `examples`;

    // @Watch<AppComponent>(`page`)
    // @Value pageIs(page: string) {
    //   return this.page === page;
    // }
  }

  /** HomePage */
  // TODO: Support merging definition / children
  // export function HomePage(properties?: core.ComponentProperties<HomePageComponent>): core.ComponentTree {
  //   return [Object.assign({ Component: HomePageComponent }, properties), []];
  // }

  // export class HomePageComponent extends Component {
    // $render() {
    //   const children: core.ComponentTree[] = [
    //     `- Level ${this.level}`,
    //     button({ type: `button`, onClick: () => this.updated = Date.now() }, `Update`)
    //   ];
    //
    //   if (this.level < 3) {
    //     children.push(HomePage({ data: { level: this.level + 1 } }));
    //     children.push(HomePage({ data: { level: this.level + 1 } }));
    //     children.push(HomePage({ data: { level: this.level + 1 } }));
    //   }
    //
    //   return div({ style: { marginLeft: `${10 * (this.level - 1)}px`, color: this.color } }, children);
    // }
    //
    // $onUpdate(changedDataKeys: string[]) {
    //   if (changedDataKeys.indexOf(`updated`) !== -1) {
    //     this.color = `green`;
    //     setTimeout(() => this.color = null, 3e3);
    //   }
    // }
    //
    // level: number;
    //
    // @Value color: string;
    // @Value updated: number;
  // }

  /** ExamplesPage */
  // TODO: Support merging definition / children
  export function ExamplesPage(properties?: core.ComponentProperties<ExamplesPageComponent>): core.ComponentTree {
    return [Object.assign({ Component: ExamplesPageComponent }, properties), []];
  }

  export class ExamplesPageComponent extends Component {
    $render() {
      return div({ title: this.name }, [
        input({
          type: `text`,
          value: this.name,
          onInput: ($event: Event) => this.name = (<HTMLInputElement>$event.target).value
        }),
        br(),
        `Text node: ${this.name}`,
        br(),
        img({ alt: `Element property: ${this.name}` }),
        div({}, `Element content: ${this.name}`),

        hr(),
        input({
          type: `color`,
          value: this.color,
          onInput: ($event: Event) => this.color = (<HTMLInputElement>$event.target).value
        }),
        Custom({
          class: `a.b.c`,
          style: { color: this.color, padding: `7px 2px 2px 2px` },
          data: {
            text: this.name,
            onChange: (text) => this.name = text
          }
        }),

        hr(),
        button({ type: `button`, onClick: () => this.counter++ }, `Count me in!`),
        ` Button clicked ${this.counter} times`,

        hr(),
        label({ class: `pointer` }, [
          input({
            type: `checkbox`,
            checked: this.checked,
            onChange: ($event?: Event) => {
              this.checked = (<HTMLInputElement>$event.target).checked;
            }
          }),
          this.getCheckedText()
        ])
        // ,
        // div({ if: this.checked }, `Conditional component A`),
        // div({ unless: this.checked }, `Conditional component B`)
      ]);
    }

    @Value name = `rendered`;
    @Value color = `#ffffff`;
    @Value counter = 0;
    @Value checked = true;

    @Watch<ExamplesPageComponent>('checked')
    @Value getCheckedText() {
      return this.checked ? `Checked` : `Unchecked`;
    }
  }

  /** Custom */
  // TODO: Support merging definition / children
  export function Custom(properties?: core.ComponentProperties<CustomComponent>): core.ComponentTree {
    return [Object.assign({ Component: CustomComponent }, properties), []];
  }

  export class CustomComponent extends Component {
    $render() {
      return div({}, [
        div({}, `Custom component: send event data`),
        input({
          type: `text`,
          value: this.text,
          onInput: ($event: Event) => this.onChange((<HTMLInputElement>$event.target).value)
        })
      ]);
    }

    @Value text: string;

    onChange: (text: string) => void;
  }
}
