import { Comment, Selector, SelectorPart } from "../nodes";
import { Lexer, Token, report } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseComment } from "./parseComment";

export const COMMON_SELECTOR_TOKENS = [
  "KEYWORD",
  "ASTERISK",
  "COLON", // psuedo classes
  "BLOCK_COMMENT",
] as const;

export const MIDLINE_SELECTOR_TOKENS = [
  ...COMMON_SELECTOR_TOKENS,
  "OPAREN",
  "COMMA",
  "RARROW",
  "LARROW",
  "OCURLY",
  "SPACE",
] as const;

export const NESTED_SELECTOR_TOKENS = [
  ...MIDLINE_SELECTOR_TOKENS,
  "AMPERSAND",
] as const;

export function parseSelector(
  lexer: Lexer,
  priorToken?: Token<(typeof NESTED_SELECTOR_TOKENS)[number]>,
  isNested?: boolean
) {
  let token =
    priorToken ??
    lexer.expect(
      ...(isNested ? NESTED_SELECTOR_TOKENS : COMMON_SELECTOR_TOKENS)
    );

  const originalLoc = token.loc;

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const parts: (SelectorPart | Comment)[] = [];

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
        break; // TODO: parse a function call
      case "COMMA":
        break; // parse next selector
      case "SPACE":
        pendingSpace = new SelectorPart(token as Token<any>);
        break;
      case "BLOCK_COMMENT":
        const comment = parseComment(lexer, token as Token<any>);
        if (!comment) return;
        parts.push(comment);
        break;
      default:
        parts.push(new SelectorPart(token as Token<any>));
        break;
    }

    token = lexer.expect(
      ...(isNested ? NESTED_SELECTOR_TOKENS : MIDLINE_SELECTOR_TOKENS)
    );

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }
  }

  return { selector: new Selector(parts, originalLoc), token };
}
