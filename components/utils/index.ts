export const get = <T extends {}>(propertyName: keyof T) => (obj: T) => obj[propertyName];

export const set = <T extends {}>(propertyName: keyof T) => (obj: T) => (value: any) => obj[propertyName] = value;

export const setFlag = <T extends {}>(obj: T, propertyName: keyof T, newValue: any = true) => {
  const originalValue = obj[propertyName];
  obj[propertyName] = newValue;

  return {
    whileAwaiting(promise: Promise<any>) {
      const unsetFlag = () => obj[propertyName] = originalValue;
      // We could use `finally`, but some promises (e.g. Firebase) don't support it
      return promise.catch(unsetFlag).then(unsetFlag);
    }
  };
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
export const result = <T>(fnOrValue: T | ((...args: any[]) => T), ...args: any[]) => typeof fnOrValue === 'function' ? fnOrValue(...args) : fnOrValue;

const uniqueIDs: Record<string, number> = {};
export const uniqueId = (prefix = '') => {
  if (uniqueIDs[prefix] == null) {
    uniqueIDs[prefix] = -1;
  }
  uniqueIDs[prefix]++;
  return prefix + uniqueIDs[prefix];
};

// TODO: Test
export const when = (value1: any, value2: any, next: Function, ...args: any[]) => (obj: {}) => {
  if (result(value1, obj) === result(value2, obj)) {
    next(...args);
  }
};
