import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('AssignmentExpression', () => {
  test('Simple assignment', () => {
    const program = 'x = 42;';
    const ast = {
      type: 'Program',
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
              value: 42,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Chained assignment', () => {
    const program = 'x = y = 42;';
    const ast = {
      type: 'Program',
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
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'y',
              },
              right: {
                type: 'NumericLiteral',
                value: 42,
              },
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Expect throw error', () => {
    const program = '42 = 42;';

    expect(() => new Parser().parse(program)).toThrow();
  });
});
