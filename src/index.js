import { Parser } from './parser';

const parser = new Parser();
let program = `

2 * 2 + 3;

`;
let ast = parser.parse(program);
console.dir(ast, { depth: null });
