import * as m from 'mithril';
export const Mithril = m;

export interface App extends Component {
  update(...args: any[]): void;
}

export interface Component {
  render(...args: any[]): Mithril.Children;
}
