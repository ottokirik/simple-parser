/**
 * Tokenizer spec.
 */
const SPEC = [
  [/^\d+/, 'NUMBER'],
  [/^"([^"]*)"/, 'STRING'],
  [/^'([^']*)'/, 'STRING'],
];

/**
 * Tokenizer class.
 *
 * Lazily pulls a token from a stream.
 */
class Tokenizer {
  /**
   * Initializes the string.
   */
  init(str) {
    this.str = str;
    this.cursor = 0;
  }

  /**
   * Whether we have reached the end of the string.
   */
  isEOF() {
    return this.cursor === this.str.length;
  }

  /**
   * Whether we still have more tokens.
   */
  hasMoreTokens() {
    return this.cursor < this.str.length;
  }

  /**
   * Obtains next token.
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const str = this.str.slice(this.cursor);

    for (const [regexp, tokenType] of SPEC) {
      const tokenValue = this.match(regexp, str);

      if (tokenValue !== null) {
        return {
          type: tokenType,
          value: tokenValue,
        };
      }
    }

    throw new SyntaxError(`Unexpected token "${str[0]}"`);
  }

  /**
   * Matches a token for a regular expression.
   */
  match(regexp, str) {
    const matched = regexp.exec(str);

    if (matched === null) {
      return null;
    }

    this.cursor += matched[0].length;
    return matched[0];
  }
}

export { Tokenizer };
