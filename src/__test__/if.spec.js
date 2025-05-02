import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('IfStatement', () => {
  test('IfStatement', () => {
    const program = `
      
      if (x) { x = 1; }
      else { x = 2; }      

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'IfStatement',
          test: { type: 'Identifier', name: 'x' },
          consequent: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 1,
                  },
                },
              },
            ],
          },
          alternate: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 2,
                  },
                },
              },
            ],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('IfStatement, no alternate', () => {
    const program = `
      
      if (x) { x = 1; }   

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'IfStatement',
          test: { type: 'Identifier', name: 'x' },
          consequent: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 1,
                  },
                },
              },
            ],
          },
          alternate: null,
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('IfStatement, no block statement', () => {
    const program = `
      
      if (x) x = 1;

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'IfStatement',
          test: { type: 'Identifier', name: 'x' },
          consequent: {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'NumericLiteral',
                value: 1,
              },
            },
          },
          alternate: null,
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('IfStatement', () => {
    const program = `
      
      if (x > 10) { x = 0; }
      else { x += 1; }      

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'IfStatement',
          test: {
            type: 'BinaryExpression',
            operator: '>',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 10 },
          },
          consequent: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 0,
                  },
                },
              },
            ],
          },
          alternate: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '+=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
