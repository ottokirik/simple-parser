import { Parser } from './parser';

const parser = new Parser();
const program = '42';
const ast = parser.parse(program);

console.dir(ast, { depth: null });
