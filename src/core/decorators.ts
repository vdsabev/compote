module compote.core {
  /**
   * Value
   * Decorates a class property or method to be used in element attributes or content
   */
  export function Value(target: Component, key: string, propertyDescriptor?: PropertyDescriptor) {
    // Class method
    if (propertyDescriptor && typeof propertyDescriptor.value === 'function') {
      const originalMethod = propertyDescriptor.value;
      propertyDescriptor.value = function (this: Component, ...args: any[]): any {
        if (this.$rendering) {
          // TODO: Possibly cache the arguments instead of parsing them
          const additionalArguments = args.map((arg) => `'${arg}'`).join(', ');
          return Parser.surroundExpression(`${this.$id}.${key}(${additionalArguments})`);
        }
        return originalMethod.apply(this, args);
      };
    }
    // Class property
    else {
      const privateKey = `$$${key}`;
      Object.defineProperty(target, key, {
        get(this: Component) {
          if (this.$rendering) {
            return Parser.surroundExpression(`${this.$id}.${key}`);
          }
          return (<any>this)[privateKey];
        },
        set(this: Component, value: any) {
          (<any>this)[privateKey] = value;
          if (!this.$initializing) {
            const changes = getChanges(target.$watches, this, key, value);
            this.$update(changes);
          }
        }
      });
    }
  }

  export function Watch<T extends Component>(
    key1: keyof T, key2?: keyof T, key3?: keyof T,
    key4?: keyof T, key5?: keyof T, key6?: keyof T,
    key7?: keyof T, key8?: keyof T, key9?: keyof T
  ) {
    const argKeys = Array.from(arguments);

    return (target: T, key: keyof T, propertyDescriptor: PropertyDescriptor) => {
      if (typeof propertyDescriptor.value !== 'function') throw new Error(`Invalid watched function: ${propertyDescriptor.value}`);

      if (!target.$watches) {
        target.$watches = [];
      }

      target.$watches.push([key, argKeys]);
    };
  }

  /** Utils */
  function getChanges(watches: ComponentWatch[], component: Component, key: string, value: any): Record<string, any> {
    const changes = { [key]: value };
    if (watches) {
      for (let [watchKey, watchDependencies] of watches) {
        if (watchDependencies.indexOf(key) !== -1) {
          changes[watchKey] = (<any>component)[watchKey]();
        }
      }
    }

    return changes;
  }
}
