module compote.core {
  /** Bind */
  export function bind(access: 'get' | 'set') {
    return (target: Component, key: string, propertyDescriptor?: PropertyDescriptor): any => {
      // Class method
      if (propertyDescriptor && typeof propertyDescriptor.value === 'function') {
        const originalMethod = propertyDescriptor.value;
        propertyDescriptor.value = function (this: Component, ...args: any[]): any {
          if (this.$rendering) {
            const binding = `${this.$id}.${key}(event)`;
            switch (access) {
              case 'get':
                return Parser.surroundExpression(binding);
              case 'set':
                return `Compote.${binding}`;
              default:
                throw new Error(`Invalid binding access: ${access}`);
            }
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
            this.$update(); // TODO: Pass component, key, and value
          }
        });
      }
    };
  }
}
