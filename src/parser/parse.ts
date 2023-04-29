import { Token, report, Lexer } from "../tokenize";

import { ParserError } from "./ParserError";
import { Comment, Selector, SelectorPart } from "./nodes";

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

const common = [
  "KEYWORD",
  "ASTERISK",
  "COLON", // psuedo classes
] as const;

const active = [
  ...common,
  "OPAREN",
  "COMMA",
  "RARROW",
  "LARROW",
  "OCURLY",
  "SPACE",
] as const;

const nested = [...active, "AMPERSAND"] as const;

export function parseSelector(
  lexer: Lexer,
  priorToken?: any,
  isNested?: boolean
) {
  let token = lexer.expect(...(isNested ? nested : common));

  const originalLoc = token.loc;

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const parts: SelectorPart[] = [];

  let isPsudeo = false;
  let pendingSpace: SelectorPart | null = null;

  while (token.type !== "OCURLY") {
    if (pendingSpace) {
      parts.push(pendingSpace);
      pendingSpace = null;
    }

    switch (token.type) {
      case "KEYWORD":
        parts.push(new SelectorPart(token as Token<any>, isPsudeo));
        isPsudeo = false;
        break;
      case "COLON":
        isPsudeo = true;
        break;
      case "OPAREN":
        break; // parse a function call
      case "COMMA":
        break; // parse next selector
      case "SPACE":
        pendingSpace = new SelectorPart(token as Token<any>);
        break;
      default:
        parts.push(new SelectorPart(token as Token<any>));
        break;
      // case "OCURLY":
      //   break; // start parsing block
    }

    token = lexer.expect(...(isNested ? nested : active));

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }
  }

  return new Selector(parts, originalLoc);
}
