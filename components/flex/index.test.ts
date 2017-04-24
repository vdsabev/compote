import 'jest';
import { flex } from './index';

it(`should set '' for undefined`, () => {
  expect(flex(undefined)).toEqual({
    '-webkit-box-flex': '',
    '-moz-box-flex': '',
    '-webkit-flex': '',
    '-ms-flex': '',
    'flex': ''
  });
});

it(`should set '' for null`, () => {
  expect(flex(null)).toEqual({
    '-webkit-box-flex': '',
    '-moz-box-flex': '',
    '-webkit-flex': '',
    '-ms-flex': '',
    'flex': ''
  });
});

it(`should set 'a' for 'a'`, () => {
  expect(flex('a')).toEqual({
    '-webkit-box-flex': 'a',
    '-moz-box-flex': 'a',
    '-webkit-flex': 'a',
    '-ms-flex': 'a',
    'flex': 'a'
  });
});

it(`should set '0' for 0`, () => {
  expect(flex(0)).toEqual({
    '-webkit-box-flex': '0',
    '-moz-box-flex': '0',
    '-webkit-flex': '0',
    '-ms-flex': '0',
    'flex': '0'
  });
});

it(`should set '1' for 1`, () => {
  expect(flex(1)).toEqual({
    '-webkit-box-flex': '1',
    '-moz-box-flex': '1',
    '-webkit-flex': '1',
    '-ms-flex': '1',
    'flex': '1'
  });
});
