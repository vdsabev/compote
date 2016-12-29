module compote.core {
  /** Parser */
  export class Parser {
    static expressionStartString = '{{';
    static expressionEndString = '}}';
    static expressionString = `(?:Compote\\.)?(\\w+)\\.(\\w+)(?:\\((.*)\\))?`;
    static expressionRegex = new RegExp(Parser.expressionStartString + Parser.expressionString + Parser.expressionEndString);

    static parse(expression: string): string {
      const matches = expression && expression.toString().match(Parser.expressionRegex);
      if (!(matches && matches.length > 0)) return expression; // Move along, nothing to parse here...

      const [componentId, componentKey, componentArguments] = matches.slice(1);
      const component = Compote[componentId];
      let value = (<any>component)[componentKey];
      if (typeof value === 'function') {
        const args = (componentArguments || '').split(/\s*,\s*/).map((arg) => arg.slice(1, -1));
        value = value.apply(component, args);
      }
      const parsedExpression = expression.replace(Parser.expressionRegex, value != null ? value : '');
      return Parser.parse(parsedExpression);
    }

    static surroundExpression(expression: string): string {
      return Parser.expressionStartString + expression + Parser.expressionEndString;
    }
  }
}
