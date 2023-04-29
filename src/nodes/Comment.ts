import { Loc, Token } from "../tokenize";

export class Comment {
  readonly type = "COMMENT";
  loc: Loc;
  block: boolean;
  text: string;

  constructor(
    token: Token<"BLOCK_COMMENT"> | Token<"SINGLE_LINE_COMMENT">
  ) {
    this.block = token.type === "BLOCK_COMMENT";
    this.loc = token.loc;
    this.text = Comment.extractText(token);
  }

  static extractText(
    token: Token<"BLOCK_COMMENT"> | Token<"SINGLE_LINE_COMMENT">
  ) {
    if (token.type === "SINGLE_LINE_COMMENT") return token.value.slice(2);
    else return token.value.replace(/\/\*(.*)\*\//s, "$1");
  }
}
