module compote.core {
  export const Mithril: Mithril.Static = (<any>window).m;

  export interface App extends Component {
    update(...args: any[]): void;
  }

  export interface Component {
    render(...args: any[]): Mithril.Children;
  }
}
