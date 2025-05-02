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
   *   | IterationStatement
   *   | FunctionDeclaration
   *   | ReturnStatement
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
      case 'def':
        return this.FunctionDeclaration();
      case 'return':
        return this.ReturnStatement();
      case 'while':
      case 'for':
      case 'do':
        return this.IterationStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * FunctionDeclaration
   *   : 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
   *   ;
   */
  FunctionDeclaration() {
    this.eat('def');
    const name = this.Identifier();

    this.eat('(');
    const params =
      this.lookahead.type !== ')' ? this.FormalParameterList() : [];
    this.eat(')');

    const body = this.BlockStatement();

    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
    };
  }

  /**
   * FormalParameterList
   *  : Identifier
   *  | FormalParameterList ',' Identifier
   *  ;
   */
  FormalParameterList() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this.lookahead.type === ',' && this.eat(','));

    return params;
  }

  /**
   * ReturnStatement
   *  : 'return' OptExpression ';'
   *  ;
   */
  ReturnStatement() {
    this.eat('return');

    const argument = this.lookahead.type !== ';' ? this.Expression() : null;
    this.eat(';');

    return {
      type: 'ReturnStatement',
      argument,
    };
  }

  /**
   * IterationStatement
   *   : WhileStatement
   *   | ForStatement
   *   | DoWhileStatement
   *   ;
   */
  IterationStatement() {
    switch (this.lookahead.type) {
      case 'while':
        return this.WhileStatement();
      case 'for':
        return this.ForStatement();
      case 'do':
        return this.DoWhileStatement();
      default:
        throw new SyntaxError(
          `Unexpected token ${this.lookahead.value}, expected IterationStatement`,
        );
    }
  }

  /**
   * WhileStatement
   *   : 'while' '(' Expression ')' Statement
   *   ;
   */
  WhileStatement() {
    this.eat('while');

    this.eat('(');
    const test = this.Expression();
    this.eat(')');

    const body = this.Statement();

    return {
      type: 'WhileStatement',
      test,
      body,
    };
  }

  /**
   * ForStatement
   *   : 'for' '(' OptForStatementInit ';' OptExpression ';' OptExpression ')' Statement
   *   ;
   */
  ForStatement() {
    this.eat('for');

    this.eat('(');
    const init = this.lookahead.type !== ';' ? this.ForStatementInit() : null;
    this.eat(';');
    const test = this.lookahead.type !== ';' ? this.Expression() : null;
    this.eat(';');
    const update = this.lookahead.type !== ')' ? this.Expression() : null;
    this.eat(')');

    const body = this.Statement();

    return {
      type: 'ForStatement',
      init,
      test,
      update,
      body,
    };
  }

  /**
   * ForStatementInit
   *   : VariableStatementInit
   *   | Expression
   *   ;
   */
  ForStatementInit() {
    if (this.lookahead.type === 'let') {
      return this.VariableStatementInit();
    }

    return this.Expression();
  }

  /**
   * DoWhileStatement
   *   : 'do' Statement 'while' '(' Expression ')' ';'
   *   ;
   */
  DoWhileStatement() {
    this.eat('do');

    const body = this.Statement();
    this.eat('while');

    this.eat('(');
    const test = this.Expression();
    this.eat(')');
    this.eat(';');

    return {
      type: 'DoWhileStatement',
      body,
      test,
    };
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
   * VariableStatementInit
   *   : 'let' VariableDeclarationList
   *   ;
   */
  VariableStatementInit() {
    this.eat('let');
    const declarations = this.VariableDeclarationList();

    return {
      type: 'VariableStatement',
      declarations,
    };
  }

  /**
   * VariableStatement
   *   : 'let' VariableDeclarationList ';'
   *   ;
   */
  VariableStatement() {
    const variableStatement = this.VariableStatementInit();
    this.eat(';');

    return variableStatement;
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
   *   : LogicalORExpression
   *   | LeftHandSideExpression AssignmentOperator AssignmentExpression
   */
  AssignmentExpression() {
    const left = this.LogicalORExpression();

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
   * Logical OR expression.
   *
   *   x || y
   *
   * LogicalORExpression
   *   : LogicalANDExpression LOGICAL_OR LogicalORExpression
   *   | LogicalORExpression
   *   ;
   */
  LogicalORExpression() {
    return this.LogicalExpression('LogicalANDExpression', 'LOGICAL_OR');
  }

  /**
   * Logical AND expression.
   *
   *   x && y
   *
   * LogicalANDExpression
   *   : EqualityExpression LOGICAL_AND LogicalANDExpression
   *   | EqualityExpression
   *   ;
   */
  LogicalANDExpression() {
    return this.LogicalExpression('EqualityExpression', 'LOGICAL_AND');
  }

  LogicalExpression(builderName, operatorToken) {
    let left = this[builderName]();

    while (this.lookahead.type === operatorToken) {
      // Operator
      const operator = this.eat(operatorToken).value;
      const right = this[builderName]();

      left = {
        type: 'LogicalExpression',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  /**
   * EQUALITY_OPERATOR: ==, !=
   *
   * EqualityExpression
   *   : RelationalExpression EQUALITY_OPERATOR EqualityExpression
   *   | RelationalExpression
   *   ;
   */
  EqualityExpression() {
    return this.BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR');
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
   *   : PrimaryExpression
   *   ;
   */
  LeftHandSideExpression() {
    return this.PrimaryExpression();
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
   *   : UnaryExpression
   *   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR UnaryExpression -> UnaryExpression MULTIPLICATIVE_OPERATOR UnaryExpression
   *   ;
   */
  MultiplicativeExpression() {
    return this.BinaryExpression('UnaryExpression', 'MULTIPLICATIVE_OPERATOR');
  }

  /**
   * UnaryExpression
   *   : LeftHandSideExpression
   *   | ADDITIVE_OPERATOR UnaryExpression
   *   | LOGICAL_NOT UnaryExpression
   *   ;
   */
  UnaryExpression() {
    let operator = null;

    switch (this.lookahead.type) {
      case 'ADDITIVE_OPERATOR':
        operator = this.eat('ADDITIVE_OPERATOR').value;
        break;
      case 'LOGICAL_NOT':
        operator = this.eat('LOGICAL_NOT').value;
        break;
    }

    if (operator !== null) {
      return {
        type: 'UnaryExpression',
        operator,
        argument: this.UnaryExpression(),
      };
    }

    return this.LeftHandSideExpression();
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
   *   | Identifier
   *   ;
   */
  PrimaryExpression() {
    if (this.isLiteral(this.lookahead.type)) {
      return this.Literal();
    }

    switch (this.lookahead.type) {
      case '(':
        return this.ParenthesizedExpression();
      case 'IDENTIFIER':
        return this.Identifier();
    }
  }

  /**
   * Whether the token is a literal.
   */
  isLiteral(tokenType) {
    return (
      tokenType === 'NUMBER' ||
      tokenType === 'STRING' ||
      tokenType === 'true' ||
      tokenType === 'false' ||
      tokenType === 'null'
    );
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
   *   | BooleanLiteral
   *   | NullLiteral
   *   ;
   */

  Literal() {
    switch (this.lookahead.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
      case 'true':
        return this.BooleanLiteral(true);
      case 'false':
        return this.BooleanLiteral(false);
      case 'null':
        return this.NullLiteral();
      default:
        throw new SyntaxError(
          `Unexpected token ${this.lookahead.value}, expected Literal`,
        );
    }
  }

  /**
   * BooleanLiteral
   *   : 'true'
   *   | 'false'
   *   ;
   */
  BooleanLiteral(value) {
    this.eat(value ? 'true' : 'false');

    return {
      type: 'BooleanLiteral',
      value,
    };
  }

  /**
   * NullLiteral
   *   : 'null'
   *   ;
   */
  NullLiteral() {
    this.eat('null');

    return {
      type: 'NullLiteral',
      value: null,
    };
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
