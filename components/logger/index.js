export function logger(store) {
    return function (next) {
        return function (action) {
            console.log('dispatching', action); // tslint:disable-line no-console
            var result = next(action);
            console.log('next state', store.getState()); // tslint:disable-line no-console
            return result;
        };
    };
}
