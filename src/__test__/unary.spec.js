import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('Unary operator', () => {
  test('Unary operator, -', () => {
    const program = '-x;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'UnaryExpression',
            operator: '-',
            argument: {
              type: 'Identifier',
              name: 'x',
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Unary operator, !', () => {
    const program = '!x;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'UnaryExpression',
            operator: '!',
            argument: {
              type: 'Identifier',
              name: 'x',
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Unary operator, --', () => {
    const program = '--x;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'UnaryExpression',
            operator: '-',
            argument: {
              type: 'UnaryExpression',
              operator: '-',
              argument: {
                type: 'Identifier',
                name: 'x',
              },
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
