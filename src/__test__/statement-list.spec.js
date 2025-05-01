import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('StatementList', () => {
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
});
