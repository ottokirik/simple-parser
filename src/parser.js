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
   *   : Literal
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

  StatementList() {
    const statementList = [this.Statement()];

    while (this.lookahead !== null) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement
   *   : ExpressionStatement
   *   ;
   */
  Statement() {
    return this.ExpressionStatement();
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
   * Expression
   *   : Literal
   *   ;
   */
  Expression() {
    return this.Literal();
  }

  /**
   * Literal
   *   : NumericLiteral
   *   | StringLiteral
   *  ;
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
