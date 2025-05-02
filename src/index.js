import { Parser } from './parser';

const parser = new Parser();
let program = `
      {
        42;
  
        "hello";
      }
    `;
let ast = parser.parse(program);
console.dir(ast, { depth: null });
