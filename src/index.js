import { Parser } from './parser';

const parser = new Parser();
const program = '"Hello"';
const ast = parser.parse(program);

console.dir(ast, { depth: null });
