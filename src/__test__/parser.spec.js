import { test, expect } from 'bun:test';
import { Parser } from '../parser';

const createSingleExpression = (value, type) => {
  return {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type,
          value,
        },
      },
    ],
  };
};

test('Number', () => {
  const input = '42;';
  const result = createSingleExpression(42, 'NumericLiteral');

  expect(new Parser().parse(input)).toEqual(result);
});

test('String', () => {
  const input = '"String";';
  const result = createSingleExpression('String', 'StringLiteral');

  expect(new Parser().parse(input)).toEqual(result);
});

test('String', () => {
  const input = `'String';`;
  const result = createSingleExpression('String', 'StringLiteral');

  expect(new Parser().parse(input)).toEqual(result);
});

test('StatementList', () => {
  const program = `

    /**
     * Document comment
     */
    42;

    // Comment
    "Hello";

    `;
  const ast = {
    type: 'Program',
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
          value: 'Hello',
        },
      },
    ],
  };

  expect(new Parser().parse(program)).toEqual(ast);
});

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

test('EmptyStatement', () => {
  const input = ';';
  const result = {
    type: 'Program',
    body: [
      {
        type: 'EmptyStatement',
      },
    ],
  };

  expect(new Parser().parse(input)).toEqual(result);
});
