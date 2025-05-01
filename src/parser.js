import { Tokenizer } from './tokenizer';

/**
 * Letter parser: recursive descent parser
 */
class Parser {
  /**
   * Initializes the parser.
   */
  constructor() {
    this.input = '';
    this.tokenizer = new Tokenizer();
  }

  /**
   * Parses a string into an AST.
   */
  parse(input) {
    this.input = input;
    this.tokenizer.init(input);

    // Prime the tokenizer obtain the first token which is our lookahead. The lookahead is used for predictive parsing.
    this.lookahead = this.tokenizer.getNextToken();

    // Parse recursively starting from the main entry point, the Program.
    return this.Program();
  }

  /**
   * Main entry point.
   *
   * Program
   *   : StatementList
   *   ;
   */
  Program() {
    return {
      type: 'Program',
      body: this.StatementList(),
    };
  }

  /**
   * StatementList
   *   : Statement
   *   | StatementList Statement -> Statement Statement Statement
   *   ;
   */

  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()];

    while (this.lookahead !== null && this.lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement
   *   : ExpressionStatement
   *   | BlockStatement
   *   ;
   */
  Statement() {
    switch (this.lookahead.type) {
      case ';':
        return this.EmptyStatement();
      case '{':
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * ExpressionStatement
   *   : Expression ';'
   *   ;
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this.eat(';');

    return {
      type: 'ExpressionStatement',
      expression,
    };
  }

  /**
   * BlockStatement
   *   : '{' OptStatementList '}'
   *   ;
   */
  BlockStatement() {
    this.eat('{');

    const body = this.lookahead.type === '}' ? [] : this.StatementList('}');

    this.eat('}');

    return {
      type: 'BlockStatement',
      body,
    };
  }

  /**
   * EmptyStatement
   *   : ';'
   *   ;
   */
  EmptyStatement() {
    this.eat(';');

    return {
      type: 'EmptyStatement',
    };
  }

  /**
   * Expression
   *   : AdditiveExpression
   *   ;
   */
  Expression() {
    return this.AdditiveExpression();
  }

  /**
   * AdditiveExpression
   *   : MultiplicativeExpression
   *   | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression -> MultiplicativeExpression ADDITIVE_OPERATOR MultiplicativeExpression ADDITIVE_OPERATOR MultiplicativeExpression
   *   ;
   */
  AdditiveExpression() {
    return this.BinaryExpression(
      'MultiplicativeExpression',
      'ADDITIVE_OPERATOR',
    );
  }

  /**
   * MultiplicativeExpression
   *   : PrimaryExpression
   *   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression -> PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   *   ;
   */
  MultiplicativeExpression() {
    return this.BinaryExpression(
      'PrimaryExpression',
      'MULTIPLICATIVE_OPERATOR',
    );
  }

  /**
   * Generic BinaryExpression.
   */
  BinaryExpression(builderName, operatorToken) {
    let left = this[builderName]();

    while (this.lookahead.type === operatorToken) {
      // Operator
      const operator = this.eat(operatorToken).value;
      const right = this[builderName]();

      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  /**
   * PrimaryExpression
   *   : Literal
   *   | ParenthesizedExpression
   *   ;
   */
  PrimaryExpression() {
    switch (this.lookahead.type) {
      case '(':
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  /**
   * ParenthesizedExpression
   *   : '(' Expression ')'
   *   ;
   */
  ParenthesizedExpression() {
    this.eat('(');
    const expression = this.Expression();
    this.eat(')');

    return expression;
  }

  /**
   * Literal
   *   : NumericLiteral
   *   | StringLiteral
   *   ;
   */

  Literal() {
    switch (this.lookahead.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
      default:
        throw new SyntaxError(
          `Unexpected token ${this.lookahead.value}, expected Literal`,
        );
    }
  }

  /**
   * StringLiteral
   *   : STRING
   *   ;
   */
  StringLiteral() {
    const token = this.eat('STRING');

    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1), // Remove the quotes.
    };
  }

  /**
   * NumericLiteral
   *   : NUMBER
   *   ;
   */
  NumericLiteral() {
    const token = this.eat('NUMBER');

    return {
      type: 'NumericLiteral',
      value: Number(token.value),
    };
  }

  eat(tokenType) {
    const token = this.lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input, expected ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token ${token.value}, expected ${tokenType}`,
      );
    }

    this.lookahead = this.tokenizer.getNextToken();

    return token;
  }
}

export { Parser };
