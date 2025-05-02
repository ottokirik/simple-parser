import { test, expect, describe } from 'bun:test';
import { Parser } from '../parser';

describe('FunctionDeclaration', () => {
  test('FunctionDeclaration', () => {
    const program = `
    
      def square(x) {
        return x * x;
      }      

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'FunctionDeclaration',
          name: {
            type: 'Identifier',
            name: 'square',
          },
          params: [
            {
              type: 'Identifier',
              name: 'x',
            },
          ],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'BinaryExpression',
                  operator: '*',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
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

  test('FunctionDeclaration, empty', () => {
    const program = `
    
      def empty() {
        return;
      }      

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'FunctionDeclaration',
          name: {
            type: 'Identifier',
            name: 'empty',
          },
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: null,
              },
            ],
          },
        },
      ],
    };

    expect(new Parser().parse(program)).toEqual(ast);
  });

  test('FunctionDeclaration, empty without return', () => {
    const program = `
    
      def empty() {}      

    `;
    const ast = {
      type: 'Program',
      body: [
        {
          type: 'FunctionDeclaration',
          name: {
            type: 'Identifier',
            name: 'empty',
          },
          params: [],
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
