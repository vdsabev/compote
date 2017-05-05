import 'jest';

import { get, set, setFlag, groupBy, keys, last, uniqueId } from './index';

describe(`get`, () => {
  it(`should get property value`, () => {
    expect(get<{ a: number }>('a')({ a: 1 })).toBe(1);
  });
});

describe(`set`, () => {
  it(`should set property value`, () => {
    const obj = { a: 0 };
    set<typeof obj>('a')(obj)(1);
    expect(obj.a).toBe(1);
  });
});

describe(`setFlag`, () => {
  it(`should set flag`, () => {
    const obj = { a: 0 };
    setFlag(obj, 'a', 1);
    expect(obj.a).toBe(1);
  });

  it(`should default flag value to true`, () => {
    const obj = { a: false };
    setFlag(obj, 'a');
    expect(obj.a).toBe(true);
  });

  it(`should revert flag after resolve`, async () => {
    const obj = { a: 0 };
    let resolve: Function;
    const promise = new Promise((_resolve, _reject) => resolve = _resolve);
    const newPromise = setFlag(obj, 'a', 1).whileAwaiting(promise);
    expect(obj.a).toBe(1);
    resolve();
    await newPromise;
    expect(obj.a).toBe(0);
  });

  it(`should revert flag after reject`, async () => {
    const obj = { a: 0 };
    let reject: Function;
    const promise = new Promise((_resolve, _reject) => reject = _reject);
    const newPromise = setFlag(obj, 'a', 1).whileAwaiting(promise);
    expect(obj.a).toBe(1);
    reject();
    await newPromise;
    expect(obj.a).toBe(0);
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
    expect(last([1, 2, 3])).toBe(3);
  });

  it(`should return last array item when single item`, () => {
    expect(last([1])).toBe(1);
  });

  it(`should return undefined when no items`, () => {
    expect(last([])).toBe(undefined);
  });

  it(`should return undefined when null`, () => {
    expect(last(null)).toBe(undefined);
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
