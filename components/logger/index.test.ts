import 'jest';
import { logger } from './index';

const store = <any>{ getState: jest.fn(() => 'state') };

it(`should return a function 1st`, () => {
  expect(typeof logger(store)).toBe('function');
});

it(`should return a function 2nd`, () => {
  const next = jest.fn();
  expect(typeof logger(store)(next)).toBe('function');
});

it(`should return the result of next`, () => {
  console.log = jest.fn();
  const next = jest.fn(() => 'result');
  const action = {};
  expect(logger(store)(next)(action)).toBe('result');
  expect(store.getState).toHaveBeenCalled();
  expect(next).toHaveBeenCalledWith(action);
  expect(console.log).toHaveBeenCalledWith('dispatching', action);
  expect(console.log).toHaveBeenCalledWith('next state', store.getState());
});
