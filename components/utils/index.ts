export function get<T extends {}>(propertyName: keyof T) {
  return (obj: T) => obj[propertyName];
}

export function groupBy<T>(propertyName: keyof T) {
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
}

export function keys<T extends {}>(obj: T) {
  return Object.keys(obj);
}

export function last<T>(array: T[]): T {
  return array ? array[array.length - 1] : undefined;
}

const uniqueIDs: Record<string, number> = {};
export function uniqueId(prefix = '') {
  if (uniqueIDs[prefix] == null) {
    uniqueIDs[prefix] = -1;
  }
  uniqueIDs[prefix]++;
  return prefix + uniqueIDs[prefix];
}
