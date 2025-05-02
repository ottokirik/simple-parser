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
   *   | EmptyStatement
   *   | VariableStatement
   *   | IfStatement
   *   ;
   */
  Statement() {
    switch (this.lookahead.type) {
      case ';':
        return this.EmptyStatement();
      case '{':
        return this.BlockStatement();
      case 'let':
        return this.VariableStatement();
      case 'if':
        return this.IfStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * IfStatement
   *   : 'if' '(' Expression ')' Statement
   *   | 'if' '(' Expression ')' Statement 'else' Statement
   *   ;
   */
  IfStatement() {
    this.eat('if');
    this.eat('(');
    const test = this.Expression();
    this.eat(')');

    const consequent = this.Statement();
    const alternate =
      this.lookahead !== null && this.lookahead.type === 'else'
        ? this.eat('else') && this.Statement()
        : null;

    return { type: 'IfStatement', test, consequent, alternate };
  }

  /**
   * VariableStatement
   *   : 'let' VariableDeclarationList ';'
   *   ;
   */
  VariableStatement() {
    this.eat('let');
    const declarations = this.VariableDeclarationList();
    this.eat(';');

    return {
      type: 'VariableStatement',
      declarations,
    };
  }

  /**
   * VariableDeclarationList
   *   : VariableDeclaration
   *   | VariableDeclarationList ',' VariableDeclaration
   *   ;
   */
  VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (this.lookahead.type === ',' && this.eat(','));

    return declarations;
  }

  /**
   * VariableDeclaration
   *   : Identifier OptVariableInitializer
   *   ;
   */
  VariableDeclaration() {
    const id = this.Identifier();

    // OptVariableInitializer
    const init =
      this.lookahead.type !== ';' && this.lookahead.type !== ','
        ? this.VariableInitializer()
        : null;

    return {
      type: 'VariableDeclaration',
      id,
      init,
    };
  }

  /**
   * VariableInitializer
   *   : SIMPLE_ASSIGNMENT AssignmentExpression
   *   ;
   */
  VariableInitializer() {
    this.eat('SIMPLE_ASSIGNMENT');

    return this.AssignmentExpression();
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
   *   : AssignmentExpression
   *   ;
   */
  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *   : RelationalExpression
   *   | LeftHandSideExpression AssignmentOperator AssignmentExpression
   */
  AssignmentExpression() {
    const left = this.RelationalExpression();

    if (!this.isAssignmentOperator(this.lookahead.type)) {
      return left;
    }

    return {
      type: 'AssignmentExpression',
      operator: this.AssignmentOperator().value,
      left: this.checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  /**
   * RELATIONAL_OPERATOR: >, >=, <, <=
   *
   * RelationalExpression
   *   : AdditiveExpression
   *   | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
   *   ;
   */
  RelationalExpression() {
    return this.BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
  }

  /**
   * LeftHandSideExpression
   *   : Identifier
   *   ;
   */
  LeftHandSideExpression() {
    return this.Identifier();
  }

  /**
   * Identifier
   *   : IDENTIFIER
   *   ;
   */
  Identifier() {
    const name = this.eat('IDENTIFIER').value;

    return {
      type: 'Identifier',
      name,
    };
  }

  /**
   * Extra check whether it's valid assignment target.
   */
  checkValidAssignmentTarget(node) {
    if (node.type === 'Identifier') {
      return node;
    }

    throw new SyntaxError('Invalid left-hand side in assignment expression');
  }

  /**
   * Whether the token is an assignment operator.
   */
  isAssignmentOperator(tokenType) {
    return (
      tokenType === 'SIMPLE_ASSIGNMENT' || tokenType === 'COMPLEX_ASSIGNMENT'
    );
  }

  /**
   * AssignmentOperator
   *   : SIMPLE_ASSIGNMENT
   *   | COMPLEX_ASSIGNMENT
   *   ;
   */
  AssignmentOperator() {
    if (this.lookahead.type === 'SIMPLE_ASSIGNMENT') {
      return this.eat('SIMPLE_ASSIGNMENT');
    }

    return this.eat('COMPLEX_ASSIGNMENT');
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
   *   | LeftHandSideExpression
   *   ;
   */
  PrimaryExpression() {
    if (this.isLiteral(this.lookahead.type)) {
      return this.Literal();
    }

    switch (this.lookahead.type) {
      case '(':
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  /**
   * Whether the token is a literal.
   */
  isLiteral(tokenType) {
    return tokenType === 'NUMBER' || tokenType === 'STRING';
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
