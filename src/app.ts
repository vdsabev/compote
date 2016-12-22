module compote.app {
  // const { Component, html, watch } = core;
  const { watch } = core;

  export class HelloLabelComponent {
    $el: HTMLElement;

    @watch label: string;
    interval: number;

    constructor(data: Partial<HelloLabelComponent>) {
      this.$el = document.createElement('div');
      Object.assign(this, data);
      this.$init();
    }

    $init() {
      setInterval(() => {
        this.label = new Date().toISOString();
      }, this.interval);
    }

    $update() {
      this.$el.innerHTML = `Hello ${this.label}`;
    }

    $render() {
      return `<div>Hello ${this.label}</div>`;
    }
  }

  const helloLabel = new HelloLabelComponent({
    label: 'World',
    interval: 1e3
  });

  // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  const container = document.getElementById('container');
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }

  container.appendChild(helloLabel.$el);

  // export function HelloLabel(data: Partial<HelloLabelComponent>) {
  //   const { div } = html;
  //   return div({ className: 'hello-label' }, `Hello ${data.name}`);
  // }
  //
  // export class HelloLabelComponent extends Component {
  //   @watch name: string;
  //
  //   constructor(data?: Partial<HelloLabelComponent>) {
  //     super(data);
  //     setInterval(() => {
  //       this.name = new Date().toISOString();
  //     }, 1e3);
  //   }
  // }
  //
  // export class AppComponent extends Component {
  //   HelloLabelComponent = new HelloLabelComponent({ $parent: this, name: 'World' });
  //
  //   constructor(data?: Partial<AppComponent>) {
  //     super(data);
  //   }
  //
  //   $render() {
  //     const { br, div } = html;
  //     return div({ className: 'app' }, [
  //       br(''),
  //       HelloLabel(this.HelloLabelComponent),
  //       br(''),
  //       HelloLabel(this.HelloLabelComponent),
  //       br('')
  //     ]);
  //   }
  // }
}
