import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('Relational', () => {
  test('Relational, >', () => {
    const program = 'x > 0;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'BinaryExpression',
            operator: '>',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 0 },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
