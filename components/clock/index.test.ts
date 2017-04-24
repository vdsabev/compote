import 'jest';

jest.mock('../../html', (value: any) => ({
  svg: (attrs, children) => ({ tag: 'svg', attrs, children }),
  circle: (attrs, children) => ({ tag: 'circle', attrs, children }),
  line: (attrs, children) => ({ tag: 'line', attrs, children })
}));

import { minutesToXY, Clock, clockCenter, clockRadius, hoursLineMultiplier, minutesLineMultiplier } from './index';

describe(`minutesToXY`, () => {
  it(`should work for 0`, () => {
    const [x, y] = minutesToXY(0);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-1);
  });

  it(`should work for 15`, () => {
    const [x, y] = minutesToXY(15);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
  });

  it(`should work for 30`, () => {
    const [x, y] = minutesToXY(30);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(1);
  });

  it(`should work for 45`, () => {
    const [x, y] = minutesToXY(45);
    expect(x).toBeCloseTo(-1);
    expect(y).toBeCloseTo(0);
  });

  it(`should return same value for 0 and 60`, () => {
    const [x0, y0] = minutesToXY(0);
    const [x60, y60] = minutesToXY(60);
    expect(x0).toBeCloseTo(x60);
    expect(y0).toBeCloseTo(y60);
  });
});

describe(`Clock`, () => {
  it(`should render SVG`, () => {
    expect(Clock(new Date()).tag).toBe('svg');
  });

  it(`should render static clock hands`, () => {
    const children = <Mithril.VirtualElement[]>Clock(new Date()).children;
    expect(children[1].attrs.x2).toBeCloseTo(clockCenter + hoursLineMultiplier * 1 * clockRadius);
    expect(children[1].attrs.y2).toBeCloseTo(clockCenter + hoursLineMultiplier * 0 * clockRadius);
    expect(children[2].attrs.x2).toBeCloseTo(clockCenter + minutesLineMultiplier * 0 * clockRadius);
    expect(children[2].attrs.y2).toBeCloseTo(clockCenter + minutesLineMultiplier * 1 * clockRadius);
  });
});
