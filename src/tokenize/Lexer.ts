import {
  isWhitespace,
  endsKeyword,
  startsKeyword,
  joinTypes,
} from "../common/functions";
import { ParserError } from "../parser";

import { Loc } from "./Loc";
import { LiteralTokens, Token, TokenType } from "./Token";
import { report } from "./report";

export class Lexer {
  cursor = 0;
  lineStart = 0;
  row = 1;
  private _next: Token<"SPACE"> | null;

  constructor(public source: string, public filePath: string) {
    this._next = null;
  }

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

  isSelectorOrDeclaration() {
    let i = 0;
    while (
      this.source[this.cursor + i] !== "{" &&
      this.source[this.cursor + i] !== ";"
    ) {
      i++;
      if (!this.source[this.cursor + i]) return "selector";
    }
    if (this.source[this.cursor + i] === "{") return "selector";
    else return "declaration";
  }

  parseNext() {
    let i = 0;
    while (isWhitespace(this.source[this.cursor + i])) i++;
    if (this.source[this.cursor + i] === "@") {
      if (this.isSelectorOrDeclaration() === "selector") return "MEDIA_QUERY";
      else return "AT_RULE";
    }

    if (this.cursor + i >= this.source.length) return "END";

    return "RULE";
  }

  nextToken() {
    if (this._next) {
      const token = this._next;
      this._next = null;
      return token;
    }

    this.trimLeft();

    if (this.isEmpty()) return;

    // single line comment
    if (this.current(2) === "//") {
      const loc = this.loc();
      const start = this.cursor;
      this.dropLine();
      return new Token(
        "SINGLE_LINE_COMMENT",
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
        "BLOCK_COMMENT",
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

      return new Token("KEYWORD", this.source.slice(start, this.cursor), loc);
    }

    // keyword
    if (startsKeyword(this.current())) {
      const loc = this.loc();
      const start = this.cursor;

      let hasNumber = /[0-9]/.test(this.current());

      this.chopChar();

      while (this.isNotEmpty() && !endsKeyword(this.current(), hasNumber)) {
        this.chopChar();
        hasNumber = /[0-9.]/.test(this.current());
      }

      if (this.current() === " ") {
        this._next = new Token("SPACE", " ", this.loc());
      }

      return new Token("KEYWORD", this.source.slice(start, this.cursor), loc);
    }

    if (Object.keys(LiteralTokens).includes(this.current())) {
      const token = new Token(
        LiteralTokens[this.current() as keyof typeof LiteralTokens],
        this.current(),
        this.loc()
      );

      let watchSpace = this.current() === "&" || this.current() === "*";

      this.chopChar();

      if (watchSpace && this.current() === " ") {
        this._next = new Token("SPACE", " ", this.loc());
      }

      return token;
    }

    report("Unrecognized token", this.loc());
    throw new Error("Unrecognized token");
  }

  expect<TTypes extends TokenType[]>(
    ...types: TTypes
  ): ParserError | Token<TTypes[number]> {
    const originalLoc = this.loc();
    const token = this.nextToken();

    if (!token) {
      return new ParserError(
        `Expected ${joinTypes(types)} but reached end of file`,
        originalLoc
      );
    }

    if (types.length && !types.includes(token.type)) {
      return new ParserError(
        `Expected ${joinTypes(types)} but got ${token.type}`,
        token.loc
      );
    }

    return token;
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
