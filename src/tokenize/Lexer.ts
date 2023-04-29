import { isWhitespace, selectorEnd, startsSelector } from "../common/functions";
import { Loc } from "./Loc";
import { Token, TokenType } from "./Token";

export class Lexer {
  cursor = 0;
  lineStart = 0;
  row = 1;

  constructor(public source: string, public filePath: string) { }

  current(amount = 1) {
    let result = "";
    for (let i = 0; i < amount; i++) {
      result += this.source[this.cursor + i];
    }
    return result;
  }

  chopChar() {
    if (this.current() === "\n") {
      this.row++;
      this.lineStart = this.cursor + 1;
    }

    this.cursor++;
  }

  isEmpty() {
    return this.cursor >= this.source.length;
  }

  isNotEmpty() {
    return !this.isEmpty();
  }

  trimLeft() {
    while (this.isNotEmpty() && isWhitespace(this.current())) {
      this.chopChar();
    }
  }

  dropLine() {
    while (this.isNotEmpty() && this.current() !== "\n") {
      this.chopChar();
    }
  }

  loc() {
    return new Loc(this.filePath, this.row, this.cursor - this.lineStart + 1);
  }

  nextToken() {
    this.trimLeft();

    if (this.isEmpty()) return;

    // single line comment
    if (this.current(2) === "//") {
      const loc = this.loc();
      const start = this.cursor;
      this.dropLine();
      return new Token(
        TokenType.SINGLE_LINE_COMMENT,
        this.source.slice(start, this.cursor),
        loc
      );
    }

    // multi line comment
    if (this.current(2) === "/*") {
      const loc = this.loc();
      const start = this.cursor;
      while (this.isNotEmpty() && this.current(2) !== "*/") {
        this.chopChar();
      }

      if (this.isNotEmpty()) {
        // chop the final "*/"
        this.chopChar();
        this.chopChar();
      }

      return new Token(
        TokenType.MULTI_LINE_COMMENT,
        this.source.slice(start, this.cursor),
        loc
      );
    }

    // attribute selector
    if (this.current() === "[") {
      const loc = this.loc();
      const start = this.cursor;

      while (this.isNotEmpty() && this.current() !== "]") {
        this.chopChar();
      }

      this.chopChar();

      return new Token(
        TokenType.SELECTOR,
        this.source.slice(start, this.cursor),
        loc
      );
    }

    // selector
    if (startsSelector(this.current())) {
      const loc = this.loc();
      const start = this.cursor;

      this.chopChar();

      while (this.isNotEmpty() && !selectorEnd(this.current())) {
        this.chopChar();
      }

      return new Token(
        TokenType.SELECTOR,
        this.source.slice(start, this.cursor),
        loc
      );
    }
  }

  *[Symbol.iterator]() {
    let token = this.nextToken();
    while (token) {
      yield token;
      token = this.nextToken();
    }

    return;
  }
}
