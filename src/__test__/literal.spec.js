import { test, expect, describe } from 'bun:test';
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

describe('Literal test', () => {
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
});
