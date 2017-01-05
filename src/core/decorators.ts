module compote.core {
  /**
   * Value
   * Decorates a class property or method to be used in element properties or content
   */
  export function Value(ComponentClass: Component, key: string, propertyDescriptor?: PropertyDescriptor) {
    // Class method
    if (propertyDescriptor && typeof propertyDescriptor.value === 'function') {
      const originalMethod = propertyDescriptor.value;
      propertyDescriptor.value = function (this: Component, ...args: any[]): any {
        if (this.$rendering) {
          // TODO: Possibly cache the arguments instead of parsing them if we want to support more than strings
          return Parser.createExpression(this.$id, key, args);
        }
        return originalMethod.apply(this, args);
      };
    }
    // Class property
    else {
      const privateKey = `$$${key}`;
      Object.defineProperty(ComponentClass, key, {
        get(this: Component) {
          const value = (<any>this)[privateKey];

          if (this.$rendering) {
            const expression = Parser.createExpression(this.$id, key);
            return Array.isArray(value) ? [expression] : expression;
          }

          return value;
        },
        set(this: Component, value: any) {
          (<any>this)[privateKey] = value;
          if (!this.$initializing) {
            this.$update(this.$id, getChangedDataKeys(this, key));
          }
        }
      });
    }
  }

  export function Watch<T extends Component>(
    propertyKey1: keyof T, propertyKey2?: keyof T, propertyKey3?: keyof T,
    propertyKey4?: keyof T, propertyKey5?: keyof T, propertyKey6?: keyof T,
    propertyKey7?: keyof T, propertyKey8?: keyof T, propertyKey9?: keyof T
  ) {
    const propertyKeys = Array.from(arguments);

    return (component: T, methodKey: string, propertyDescriptor: PropertyDescriptor) => {
      if (typeof propertyDescriptor.value !== 'function') throw new Error(`Invalid watched method: ${methodKey}`);

      if (!component.$methodWatches) {
        component.$methodWatches = {};
      }

      component.$methodWatches[methodKey] = propertyKeys;
    };
  }

  /** Utils */
  function getChangedDataKeys(component: Component, changedPropertyKey: string): string[] {
    const changedDataKeys = [changedPropertyKey];
    if (component.$methodWatches) {
      for (let methodKey in component.$methodWatches) {
        if (component.$methodWatches.hasOwnProperty(methodKey)) {
          const propertyKeys = component.$methodWatches[methodKey];
          if (propertyKeys.indexOf(changedPropertyKey) !== -1) {
            changedDataKeys.push(methodKey);
          }
        }
      }
    }

    return changedDataKeys;
  }
}
