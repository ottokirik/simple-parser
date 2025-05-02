import { Parser } from './parser';

const parser = new Parser();
let program = `
      let s = "Hello, world!";
      let i = 0;

      while (i < s.length) {
        console.log(s[i]);
        i += 1;
      }
    `;
let ast = parser.parse(program);
console.dir(ast, { depth: null });
