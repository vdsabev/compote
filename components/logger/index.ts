import { Store } from 'redux';

export function logger<State, Action>(store: Store<State>) {
  return (next: (action: Action) => any) => {
    return (action: Action) => {
      console.log('dispatching', action); // tslint:disable-line no-console
      const result = next(action);
      console.log('next state', store.getState()); // tslint:disable-line no-console
      return result;
    };
  };
}
