/// <reference path="../index.d.ts" />

import 'jest';

jest.mock('../../html', () => require('../../html.common.js'));

import { AspectRatioContainer } from './index';

describe(`AspectRatioContainer`, () => {
  it(`should set padding-bottom and content`, () => {
    const children = AspectRatioContainer({ aspectRatio: { x: 2, y: 1 } }, 'a').children;
    expect(children[0].attrs.style.paddingBottom).toBe('50%');
    expect(children[1].children).toBe('a');
  });

  it(`should allow adding additional classes`, () => {
    const container = AspectRatioContainer({ className: 'a', aspectRatio: { x: 2, y: 1 } }, 'b');
    expect(container.attrs.className).toBe('aspect-ratio-container a');
  });

  it(`should gracefully handle null class`, () => {
    const container = AspectRatioContainer({ className: null, aspectRatio: { x: 2, y: 1 } }, 'b');
    expect(container.attrs.className).toBe('aspect-ratio-container ');
  });

  it(`should allow adding other properties`, () => {
    const container = AspectRatioContainer({ style: { visibility: 'hidden' }, aspectRatio: { x: 2, y: 1 } }, 'b');
    expect(container.attrs.style.visibility).toBe('hidden');
  });
});
