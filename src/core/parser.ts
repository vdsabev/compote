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

    static evaluate(expression: string): any {
      const matches = expression && expression.match(Parser.expressionRegex);
      if (!(matches && matches.length > 0)) return expression; // Move along, nothing to evaluate here...

      const [componentId, componentKey, componentArguments] = matches.slice(1);
      const component = Compote[componentId];
      let value = (<any>component)[componentKey];
      if (typeof value === 'function') {
        const args = componentArguments ? componentArguments.split(/\s*,\s*/).map((arg) => arg.slice(1, -1)) : [];
        value = value.apply(component, args);
        const createdExpression = Parser.createExpression(componentId, componentKey, args);
        if (Parser.isLiteralExpressionValue(expression, createdExpression, value)) return value;
      }

      const createdExpression = Parser.createExpression(componentId, componentKey);
      if (Parser.isLiteralExpressionValue(expression, createdExpression, value)) return value;

      const evaluatedExpression = expression.replace(Parser.expressionRegex, value != null ? value : '');
      return Parser.evaluate(evaluatedExpression);
    }

    static isLiteralExpressionValue(originalExpression: string, createdExpression: string, value: any): boolean {
      if (typeof value === 'boolean' || typeof value === 'number') {
        return originalExpression === createdExpression;
      }

      return false;
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
