import { Comment } from "../nodes";
import { Lexer, Token, report } from "../tokenize";
import { ParserError } from "./ParserError";

export function parseComment(
  lexer: Lexer,
  priorToken?: Token<"SINGLE_LINE_COMMENT" | "BLOCK_COMMENT">
) {
  const token =
    priorToken ?? lexer.expect("SINGLE_LINE_COMMENT", "BLOCK_COMMENT");

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  return new Comment(token);
}
