import 'jest';
import { Model } from './index';

it(`should assign first argument to instance`, () => {
  expect(new Model({ a: 1 })).toEqual({ a: 1 });
});

it(`should assign all arguments to instance`, () => {
  expect(new Model<any>({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
});

it(`should override properties`, () => {
  expect(new Model({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
});
