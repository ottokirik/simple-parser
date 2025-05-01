import { Parser } from './parser';

const parser = new Parser();
let program = `

/**
 * Document comment
 */
42;

// Comment
"Hello";

`;
let ast = parser.parse(program);
console.dir(ast, { depth: null });
