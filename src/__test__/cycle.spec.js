import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('Cycle statement', () => {
  test('WhileStatement', () => {
    const program = `while (x > 10) {
      x -= 1;    
    }`;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'WhileStatement',
          test: {
            type: 'BinaryExpression',
            operator: '>',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 10 },
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '-=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('DoWhileStatement', () => {
    const program = `do {
      x -= 1;    
    } while (x > 10);`;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'DoWhileStatement',
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '-=',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 1,
                  },
                },
              },
            ],
          },
          test: {
            type: 'BinaryExpression',
            operator: '>',
            left: { type: 'Identifier', name: 'x' },
            right: { type: 'NumericLiteral', value: 10 },
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('ForStatement', () => {
    const program = `
      for (let i = 0; i < 10; i += 1) {
        x += i;    
      }
    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ForStatement',
          init: {
            type: 'VariableStatement',
            declarations: [
              {
                type: 'VariableDeclaration',
                id: { type: 'Identifier', name: 'i' },
                init: { type: 'NumericLiteral', value: 0 },
              },
            ],
          },
          test: {
            type: 'BinaryExpression',
            operator: '<',
            left: { type: 'Identifier', name: 'i' },
            right: { type: 'NumericLiteral', value: 10 },
          },
          update: {
            type: 'AssignmentExpression',
            operator: '+=',
            left: { type: 'Identifier', name: 'i' },
            right: { type: 'NumericLiteral', value: 1 },
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '+=',
                  left: { type: 'Identifier', name: 'x' },
                  right: { type: 'Identifier', name: 'i' },
                },
              },
            ],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('ForStatement, empty', () => {
    const program = `
      for (;;) {}
    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'ForStatement',
          init: null,
          test: null,
          update: null,
          body: {
            type: 'BlockStatement',
            body: [],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });
});
