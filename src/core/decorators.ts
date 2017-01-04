module compote.core {
  /**
   * Value
   * Decorates a class property or method to be used in element properties or content
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
            // const changes = getChanges(this, key, value);
            this.$update(this.$id, key);
          }
        }
      });
    }
  }

  // TODO: Test function watches
  // export function Watch<T extends Component>(
  //   dependency1: keyof T, dependency2?: keyof T, dependency3?: keyof T,
  //   dependency4?: keyof T, dependency5?: keyof T, dependency6?: keyof T,
  //   dependency7?: keyof T, dependency8?: keyof T, dependency9?: keyof T
  // ) {
  //   const dependencies = Array.from(arguments);
  //
  //   return (target: T, key: keyof T, propertyDescriptor: PropertyDescriptor) => {
  //     if (typeof propertyDescriptor.value !== 'function') throw new Error(`Invalid watched function: ${propertyDescriptor.value}`);
  //
  //     if (!target.$watches) {
  //       target.$watches = [];
  //     }
  //
  //     target.$watches.push([key, dependencies]);
  //   };
  // }

  /** Utils */
  // function getChanges(component: Component, changedKey: string, changedValue: any): Record<string, any> {
  //   const changes = { [changedKey]: changedValue };
  //   if (component.$watches) {
  //     for (let [watchKey, watchDependencies] of component.$watches) {
  //       if (watchDependencies.indexOf(changedKey) !== -1) {
  //         changes[watchKey] = (<any>component)[watchKey]();
  //       }
  //     }
  //   }
  //
  //   return changes;
  // }
}
