import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('VariableStatement', () => {
  test('VariableStatement, with init', () => {
    const program = 'let x = 42;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'VariableStatement',
          declarations: [
            {
              type: 'VariableDeclaration',
              id: { type: 'Identifier', name: 'x' },
              init: { type: 'NumericLiteral', value: 42 },
            },
          ],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('VariableStatement, no init', () => {
    const program = 'let x;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'VariableStatement',
          declarations: [
            {
              type: 'VariableDeclaration',
              id: { type: 'Identifier', name: 'x' },
              init: null,
            },
          ],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('VariableStatement, multiple', () => {
    const program = 'let x, y;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'VariableStatement',
          declarations: [
            {
              type: 'VariableDeclaration',
              id: { type: 'Identifier', name: 'x' },
              init: null,
            },
            {
              type: 'VariableDeclaration',
              id: { type: 'Identifier', name: 'y' },
              init: null,
            },
          ],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('VariableStatement, multiple with init', () => {
    const program = 'let x, y = 42;';
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'VariableStatement',
          declarations: [
            {
              type: 'VariableDeclaration',
              id: { type: 'Identifier', name: 'x' },
              init: null,
            },
            {
              type: 'VariableDeclaration',
              id: { type: 'Identifier', name: 'y' },
              init: {
                type: 'NumericLiteral',
                value: 42,
              },
            },
          ],
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
