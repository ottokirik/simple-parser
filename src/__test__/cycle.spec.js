import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('Cycle statement', () => {
  test('WhileStatement', () => {
    const program = `while (x > 10) {
      x -= 1;    
    }`;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'WhileStatement',
          test: {
            type: 'BinaryExpression',
            operator: '>',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 10 },
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '-=',
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
