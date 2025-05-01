import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('BlockStatement', () => {
  test('BlockStatement', () => {
    const program = `
      {
        42;
  
        "hello";
      }
    `;

    const ast = {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 42,
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'StringLiteral',
                value: 'hello',
              },
            },
          ],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Empty BlockStatement', () => {
    const program = `
        {
  
        }
      `;

    const ast = {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('Nested BlockStatement', () => {
    const program = `
        {
          42;
    
          {
            "hello";
          }  
        }
      `;

    const ast = {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 42,
              },
            },
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'StringLiteral',
                    value: 'hello',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
