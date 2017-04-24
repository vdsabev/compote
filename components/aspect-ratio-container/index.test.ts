import 'jest';

jest.mock('../../html', (value: any) => ({
  div: (attrs, children) => ({ tag: 'div', attrs, children })
}));

import { AspectRatioContainer } from './index';

describe(`AspectRatioContainer`, () => {
  it(`should set padding-bottom and content`, () => {
    const children = AspectRatioContainer({ x: 2, y: 1 }, 'a').children;
    expect(children[0].attrs.style['padding-bottom']).toEqual('50%');
    expect(children[1]).toEqual('a');
  });
});
