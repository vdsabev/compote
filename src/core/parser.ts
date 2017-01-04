module compote.core {
  /** Parser */
  export class Parser {
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = `(?:Compote\\.)?(\\w+)\\.(\\w+)(?:\\((.*)\\))?`;
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static createExpression(id: string, key: string, args?: string[]) {
      if (args) {
        const additionalArguments = args.map((arg) => `'${arg}'`).join(', ');
        const expression = `${id}.${key}(${additionalArguments})`;
        return Parser.expressionStartString + expression + Parser.expressionEndString;
      }

      const expression = `${id}.${key}`;
      return Parser.expressionStartString + expression + Parser.expressionEndString;
    }

    static evaluate(expression: string): string {
      const matches = expression && expression.match(Parser.expressionRegex);
      if (!(matches && matches.length > 0)) return expression; // Move along, nothing to evaluate here...

      const [componentId, componentKey, componentArguments] = matches.slice(1);
      const component = Compote[componentId];
      let value = (<any>component)[componentKey];
      switch (typeof value) {
        case 'function':
          const args = (componentArguments || '').split(/\s*,\s*/).map((arg) => arg.slice(1, -1));
          value = value.apply(component, args);
          break;
        case 'boolean':
        case 'number':
          if (expression === Parser.createExpression(componentId, componentKey)) return value;
          break;
      }

      const evaluatedExpression = expression.replace(Parser.expressionRegex, value != null ? value : '');
      return Parser.evaluate(evaluatedExpression);
    }

    static getExpressionWatches(expression: string): ComponentWatch[] {
      const watches: ComponentWatch[] = [];

      const expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString, 'g');
      let matches: RegExpExecArray;
      while (matches = expressionRegex.exec(expression)) {
        watches.push({ id: matches[1], key: matches[2] });
      }

      return watches.length > 0 ? watches : null;
    }
  }
}
