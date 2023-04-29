import { Lexer, Token, TokenType, report } from "../tokenize";
import { ParserError, expect } from "./expect";
import { Comment } from "./nodes";

export function parseComment(
  lexer: Lexer,
  priorToken?: Token<"SINGLE_LINE_COMMENT" | "BLOCK_COMMENT">
) {
  const token =
    priorToken ??
    expect(lexer, TokenType.SINGLE_LINE_COMMENT, TokenType.BLOCK_COMMENT);

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  return new Comment(token);
}
