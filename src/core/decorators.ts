module compote.core {
  /**
   * Value
   * Decorates a class property or method to be used in element attributes or content
   */
  export function Value(target: Component, key: string, propertyDescriptor?: PropertyDescriptor) {
    // Class method
    if (propertyDescriptor && typeof propertyDescriptor.value === 'function') {
      decorateComponentMethod(key, propertyDescriptor, function (this: Component) {
        return Parser.surroundExpression(`${this.$id}.${key}(event)`);
      });
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
          this.$update({ [key]: value });
        }
      });
    }
  }

  /**
   * Event
   * Decorates a class method to be used as an element event handler
   */
  export function Event(target: Component, key: string, propertyDescriptor: PropertyDescriptor): any {
    if (!(propertyDescriptor && typeof propertyDescriptor.value === 'function')) throw new Error(`Invalid event method: ${propertyDescriptor.value}`);
    decorateComponentMethod(key, propertyDescriptor, function (this: Component) {
      return `Compote.${this.$id}.${key}(event)`;
    });
  }

  /** Utils */
  function decorateComponentMethod(
    key: string,
    propertyDescriptor: PropertyDescriptor,
    getExpression: () => string
  ) {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function (this: Component, ...args: any[]): any {
      if (this.$rendering) {
        return getExpression.call(this);
      }
      return originalMethod.apply(this, args);
    };
  }
}
