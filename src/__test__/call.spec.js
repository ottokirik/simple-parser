import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('CallExpression', () => {
  test('CallExpression', () => {
    const program = 'square(x);';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'square',
            },
            arguments: [{ type: 'Identifier', name: 'x' }],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('CallExpression, chained', () => {
    const program = 'square(x)();';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'square',
              },
              arguments: [{ type: 'Identifier', name: 'x' }],
            },
            arguments: [],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('CallExpression, member expression', () => {
    const program = 'console.log(x, y);';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              computed: false,
              object: {
                type: 'Identifier',
                name: 'console',
              },
              property: {
                type: 'Identifier',
                name: 'log',
              },
            },
            arguments: [
              { type: 'Identifier', name: 'x' },
              { type: 'Identifier', name: 'y' },
            ],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
