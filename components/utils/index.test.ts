import 'jest';

import { get, groupBy, keys, last, uniqueId } from './index';

describe(`get`, () => {
  it(`should get property value`, () => {
    expect(get<{ a: number }>('a')({ a: 1 })).toBe(1);
  });
});

describe(`groupBy`, () => {
  const items = [
    { key: 'a', value: 1 },
    { key: 'a', value: 2 },
    { key: 'b', value: 3 }
  ];
  const groupByKey = groupBy<typeof items[0]>('key');

  it(`should group by property name`, () => {
    expect(groupByKey(items)).toEqual({
      a: [
        { key: 'a', value: 1 },
        { key: 'a', value: 2 }
      ],
      b: [
        { key: 'b', value: 3 }
      ]
    });
  });
});

describe(`keys`, () => {
  it(`should return object keys`, () => {
    expect(keys({ a: 1, b: 2, c: 3 })).toEqual(['a', 'b', 'c']);
  });
});

describe(`last`, () => {
  it(`should return last array item when multiple items`, () => {
    expect(last([1, 2, 3])).toEqual(3);
  });

  it(`should return last array item when single item`, () => {
    expect(last([1])).toEqual(1);
  });

  it(`should return undefined when no items`, () => {
    expect(last([])).toEqual(undefined);
  });

  it(`should return undefined when null`, () => {
    expect(last(null)).toEqual(undefined);
  });
});

describe(`uniqueId`, () => {
  it(`should increment ID`, () => {
    expect(uniqueId()).toBe('0');
    expect(uniqueId()).toBe('1');
  });

  it(`should have individual counter for each prefix`, () => {
    expect(uniqueId('a')).toBe('a0');
    expect(uniqueId('b')).toBe('b0');
  });
});
