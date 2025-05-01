import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('EmptyStatement', () => {
  test('EmptyStatement', () => {
    const program = ';';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'EmptyStatement',
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
