/// <reference path="../index.d.ts" />

import 'jest';

jest.mock('../../html', () => require('../../html.common.js'));

import { AspectRatioContainer } from './index';

describe(`AspectRatioContainer`, () => {
  it(`should set padding-bottom and content`, () => {
    const children = AspectRatioContainer({ x: 2, y: 1 }, 'a').children;
    expect(children[0].attrs.style['padding-bottom']).toBe('50%');
    expect(children[1].children).toBe('a');
  });
});
