import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('MemberExpression', () => {
  test('MemberExpression', () => {
    const program = `
      x.y;
    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: 'x',
            },
            property: {
              type: 'Identifier',
              name: 'y',
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('MemberExpression, assignment', () => {
    const program = `
      x.y = 1;
    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              computed: false,
              object: {
                type: 'Identifier',
                name: 'x',
              },
              property: {
                type: 'Identifier',
                name: 'y',
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('MemberExpression, computed', () => {
    const program = `
      x[0] = 1;
    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              computed: true,
              object: {
                type: 'Identifier',
                name: 'x',
              },
              property: {
                type: 'NumericLiteral',
                value: 0,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('MemberExpression, chained', () => {
    const program = `
      a.b.c['d'];
    `;

    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'MemberExpression',
            computed: true,
            object: {
              type: 'MemberExpression',
              computed: false,
              object: {
                type: 'MemberExpression',
                computed: false,
                object: {
                  type: 'Identifier',
                  name: 'a',
                },
                property: {
                  type: 'Identifier',
                  name: 'b',
                },
              },
              property: {
                type: 'Identifier',
                name: 'c',
              },
            },
            property: {
              type: 'StringLiteral',
              value: 'd',
            },
          },
        },
      ],
    };
    expect(new Parser().parse(program)).toEqual(ast);
  });
});
