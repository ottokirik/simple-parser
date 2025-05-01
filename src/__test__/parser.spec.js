import { test, expect } from 'bun:test';
import { Parser } from '../parser';

const createResult = (value, type) => {
  return {
    type: 'Program',
    body: {
      type,
      value,
    },
  };
};

test('Number', () => {
  const input = '42';
  const result = createResult(42, 'NumericLiteral');

  expect(new Parser().parse(input)).toEqual(result);
});

test('String', () => {
  const input = '"String"';
  const result = createResult('String', 'StringLiteral');

  expect(new Parser().parse(input)).toEqual(result);
});

test('String', () => {
  const input = `'String'`;
  const result = createResult('String', 'StringLiteral');

  expect(new Parser().parse(input)).toEqual(result);
});
