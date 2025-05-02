import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('Equality', () => {
  test('Equality, true', () => {
    const program = 'x > 0 == true;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '==',
            left: {
              type: 'BinaryExpression',
              operator: '>',
              left: { type: 'Identifier', name: 'x' },
              right: { type: 'NumericLiteral', value: 0 },
            },
            right: { type: 'BooleanLiteral', value: true },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Equality, false', () => {
    const program = 'x >= 0 != false;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '!=',
            left: {
              type: 'BinaryExpression',
              operator: '>=',
              left: { type: 'Identifier', name: 'x' },
              right: { type: 'NumericLiteral', value: 0 },
            },
            right: { type: 'BooleanLiteral', value: false },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
