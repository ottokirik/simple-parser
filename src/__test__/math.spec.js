import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('Math', () => {
  test('BinaryExpression', () => {
    const program = '2 + 2;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 2,
            },
            right: {
              type: 'NumericLiteral',
              value: 2,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Nested BinaryExpression', () => {
    const program = '3 + 2 - 2;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '-',
            left: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                value: 3,
              },
              right: {
                type: 'NumericLiteral',
                value: 2,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 2,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Nested BinaryExpression', () => {
    const program = '2 + 2 * 3;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 2,
            },
            right: {
              type: 'BinaryExpression',
              operator: '*',
              left: {
                type: 'NumericLiteral',
                value: 2,
              },
              right: {
                type: 'NumericLiteral',
                value: 3,
              },
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Parenthesis BinaryExpression', () => {
    let program = '(2 + 2) * 3;';
    let ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '*',
            left: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                value: 2,
              },
              right: {
                type: 'NumericLiteral',
                value: 2,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 3,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);

    program = '(2);';
    ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: { type: 'NumericLiteral', value: 2 },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);

    program = '(2 + 2);';
    ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 2,
            },
            right: {
              type: 'NumericLiteral',
              value: 2,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
