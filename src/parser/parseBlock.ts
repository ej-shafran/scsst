import { Block, Comment } from "../nodes";
import { Declaration } from "../nodes/Declaration";
import { Rule } from "../nodes/Rule";
import { Lexer, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseRule } from "./parseRule";
import { parseComment } from "./parseComment";
import { parseDeclaration } from "./parseDeclaration";
import { NESTED_SELECTOR_TOKENS } from "./parseSelector";

const BLOCK_TOKENS = [
  "CCURLY",
  ...NESTED_SELECTOR_TOKENS.filter((type) => type !== "OCURLY"),
  "SINGLE_LINE_COMMENT",
] as const;

export function parseBlock(lexer: Lexer, priorToken?: Token<"OCURLY">) {
  let token: Token<TokenType> | ParserError =
    priorToken ?? lexer.expect("OCURLY");

  const originalLoc = token.loc;

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const lines: (Rule | Declaration | Comment)[] = [];

  while (token.type !== "CCURLY") {
    token = lexer.expect(...BLOCK_TOKENS);

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }

    if (
      token.type === "SINGLE_LINE_COMMENT" ||
      token.type === "BLOCK_COMMENT"
    ) {
      const comment = parseComment(lexer, token as Token<any>);
      if (!comment) return;

      lines.push(comment);
      continue;
    }

    if (token.type !== "CCURLY") {
      const toParse = lexer.isSelectorOrDeclaration();

      if (toParse == "selector") {
        const selector = parseRule(lexer, token as Token<any>, true);
        if (selector) lines.push(selector);
      } else {
        const declaration = parseDeclaration(lexer, token as Token<"KEYWORD">);
        if (declaration) lines.push(declaration);
      }
    }
  }

  return new Block(lines, originalLoc);
}
