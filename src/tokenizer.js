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

    // Numbers:
    if (!Number.isNaN(Number(str[0]))) {
      let data = '';

      while (!Number.isNaN(Number(str[this.cursor]))) {
        data += str[this.cursor];
        this.cursor += 1;
      }

      return {
        type: 'NUMBER',
        value: data,
      };
    }

    // String:
    if (str[0] === '"') {
      let data = '';

      do {
        data += str[this.cursor];
        this.cursor++;
      } while (str[this.cursor] !== '"' && !this.isEOF());

      this.cursor += 1; // Skip the closing quote.

      return {
        type: 'STRING',
        value: data,
      };
    }
  }
}

export { Tokenizer };
