export const get = <T extends {}>(propertyName: keyof T) => (obj: T) => obj[propertyName];

export const set = <T extends {}>(propertyName: keyof T) => (obj: T) => (value: any) => obj[propertyName] = value;

// TODO: Test
export const constant = <T>(value: T) => () => value;

// TODO: Test
export const identity = <T>(value: T) => value;

// TODO: Test
export const voidify = (fn: Function) => (...args: any[]) => {
  fn(...args);
};

export const groupBy = <T>(propertyName: keyof T) => {
  const valueOfProperty = get<T>(propertyName);

  return (items: T[]) => {
    const result: Record<string, T[]> = {};
    items.forEach((item) => {
      const value: any = valueOfProperty(item);
      if (!result[value]) {
        result[value] = <T[]>[];
      }
      result[value].push(item);
    });

    return result;
  };
};

export const keys = <T extends {}>(obj: T) => Object.keys(obj);

export const last = <T>(array: T[]): T => array ? array[array.length - 1] : undefined;

// TODO: Test
export const value = <T>(fnOrValue: T | ((...args: any[]) => T), ...args: any[]) => typeof fnOrValue === 'function' ? fnOrValue(...args) : fnOrValue;

const uniqueIDs: Record<string, number> = {};
export const uniqueId = (prefix = '') => {
  if (uniqueIDs[prefix] == null) {
    uniqueIDs[prefix] = -1;
  }
  uniqueIDs[prefix]++;
  return prefix + uniqueIDs[prefix];
};

// TODO: Test
export const when = (condition: any, next: Function, ...args: any[]) => (obj: {}) => {
  if (value(condition, obj)) next(...args);
};

// TODO: Test
export const equal = (value1: any, value2: any) => (obj: {}) => value(value1, obj) === value(value2, obj);
