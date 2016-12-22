module compote.core {
  /** Renderer */
  export class Renderer {
    regex = /<\s*(\w+)(?:\s+((?:\w+="\w+"\s*)+))*>([^<>]+)*</;

    parse(template: string): any {
      const matches = template.match(this.regex);

      const tagName = matches[1];
      if (!tagName) throw new Error(`Invalid tagName: ${tagName} in template: ${template}`);

      const attributes: { [key: string]: string } = {};
      const stringAttributes = matches[2];
      if (stringAttributes) {
        stringAttributes.split(/\s+/).forEach((attribute) => {
          const [key, value] = attribute.split('=');
          attributes[key] = value.slice(1, -1);
        });
      }

      return {
        tagName,
        attributes,
        content: matches[3] || ''
      };
    }
  }

  /** Watch */
  export function watch(target: any, key: string) {
    const privateKey = `$$${key}`;
    Object.defineProperty(target, key, {
      get() {
        return this[privateKey];
      },
      set(this: any, value: any) {
        (<any>this)[privateKey] = value;
        this.$update({ [key]: value });
      }
    });
  }
}
