import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('LogicalExpression', () => {
  test('LogicalExpression', () => {
    const program = 'x > 0 && y < 1;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'LogicalExpression',
            operator: '&&',
            left: {
              type: 'BinaryExpression',
              operator: '>',
              left: { type: 'Identifier', name: 'x' },
              right: { type: 'NumericLiteral', value: 0 },
            },
            right: {
              type: 'BinaryExpression',
              operator: '<',
              left: { type: 'Identifier', name: 'y' },
              right: { type: 'NumericLiteral', value: 1 },
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
