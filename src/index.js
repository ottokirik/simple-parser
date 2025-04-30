import { Parser } from './parser';

const parser = new Parser();
let program = '"Hello"';
let ast = parser.parse(program);
console.dir(ast, { depth: null });

program = '        123 ';
ast = parser.parse(program);
console.dir(ast, { depth: null });

program = `'123'`;
ast = parser.parse(program);
console.dir(ast, { depth: null });
