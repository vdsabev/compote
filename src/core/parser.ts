module compote.core {
  /** Parser */
  export class Parser {
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = '(\\w+)\\.(\\w+)';
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static parseExpression(expression: string): string {
      const matches = expression && expression.toString().match(Parser.expressionRegex);
      if (!(matches && matches.length > 0)) return expression; // Move along, nothing to parse here...

      const [componentId, componentKey] = matches.slice(1, 3);
      const value = (<any>componentInstancesCache[componentId])[componentKey];
      const parsedExpression = expression.replace(Parser.expressionRegex, value != null ? value : '');
      return Parser.parseExpression(parsedExpression);
    }

    static surroundExpression(expression: string): string {
      return Parser.expressionStartString + expression + Parser.expressionEndString;
    }
  }
}
