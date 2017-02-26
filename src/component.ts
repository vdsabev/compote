export interface App extends Renderable {
  update(...args: any[]): void;
}

export abstract class Component<DataType extends Renderable> implements Renderable {
  constructor(private app: App, data: Partial<DataType>) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        (<any>this)[key] = (<any>data)[key];
      }
    }
  }

  update() {
    this.app.update();
  }

  abstract render(...args: any[]): Mithril.Children;
}

export interface Renderable {
  render(...args: any[]): Mithril.Children;
}
