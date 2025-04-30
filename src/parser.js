/**
 * Letter parser: recursive descent parser
 */
class Parser {
    /**
     * Parses a string into an AST.
     */
    parse(input) {
        this.input = input;
        return this.Program();
    }

    /**
     * Main entry point.
     * 
     * Program
     *   : NumericLiteral
     *   ;
     */
    Program() {
        return this.NumericLiteral();
    }

    /**
     * NumericLiteral
     *   : NUMBER
     *   ;
     */
    NumericLiteral() {
        return {
            type: 'NumericLiteral',
            value: Number(this.input),
        }
    }
}

export {Parser};