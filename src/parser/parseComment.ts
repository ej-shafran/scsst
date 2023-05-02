import { Comment } from "../nodes";
import { Lexer, TokenOf } from "../tokenize";
import { safe } from "./safe";

export function parseComment(
  lexer: Lexer,
  priorToken?: TokenOf<"SINGLE_LINE_COMMENT" | "BLOCK_COMMENT">
) {
  const token =
    priorToken ?? lexer.expect("SINGLE_LINE_COMMENT", "BLOCK_COMMENT");

  return new Comment(token);
}

export default safe(parseComment);
