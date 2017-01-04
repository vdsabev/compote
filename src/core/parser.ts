module compote.core {
  /** Parser */
  export class Parser {
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = `(?:Compote\\.)?(\\w+)\\.(\\w+)(?:\\((.*)\\))?`;
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static evaluate(expression: string): string {
      const matches = expression && expression.toString().match(Parser.expressionRegex);
      if (!(matches && matches.length > 0)) return expression; // Move along, nothing to evaluate here...

      const [componentId, componentKey, componentArguments] = matches.slice(1);
      const component = Compote[componentId];
      let value = (<any>component)[componentKey];
      if (typeof value === 'function') {
        const args = (componentArguments || '').split(/\s*,\s*/).map((arg) => arg.slice(1, -1));
        value = value.apply(component, args);
      }
      const evaluatedExpression = expression.replace(Parser.expressionRegex, value != null ? value : '');
      return Parser.evaluate(evaluatedExpression);
    }

    static getExpressionWatches(expression: string): { id: string, key: string }[] {
      const watches: { id: string, key: string }[] = [];

      const expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString, 'g');
      let matches: RegExpExecArray;
      while (matches = expressionRegex.exec(expression)) {
        watches.push({ id: matches[1], key: matches[2] });
      }

      return watches.length > 0 ? watches : null;
    }

    static surroundExpression(expression: string): string {
      return Parser.expressionStartString + expression + Parser.expressionEndString;
    }
  }
}
