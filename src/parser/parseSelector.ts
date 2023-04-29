import { Comment, Selector, SelectorSection } from "../nodes";
import { FunctionCall } from "../nodes/FunctionCall";
import { Lexer, Token, report } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseComment } from "./parseComment";
import { parseFunctionCall } from "./parseFunctionCall";

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

  const parts: (SelectorSection | Comment | FunctionCall)[] = [];

  let isPsudeo = false;
  let pendingSpace: SelectorSection | null = null;

  while (token.type !== "OCURLY") {
    if (pendingSpace) {
      parts.push(pendingSpace);
      pendingSpace = null;
    }

    switch (token.type) {
      case "KEYWORD":
        parts.push(new SelectorSection(token as Token<any>, isPsudeo));
        isPsudeo = false;
        break;
      case "COLON":
        isPsudeo = true;
        break;
      case "OPAREN":
        const lastPart = parts.pop();
        if (!lastPart || lastPart.type !== "SELECTOR_PART") {
          report("Unexpected OPAREN", token.loc);
          return;
        }
        const funcCall = parseFunctionCall(
          lexer,
          Selector.contentFor(lastPart),
          lastPart.loc,
          token as Token<"OPAREN">
        );
        if (!funcCall) return;
        parts.push(funcCall);
        break;
      case "COMMA":
        break; // parse next selector
      case "SPACE":
        pendingSpace = new SelectorSection(token as Token<any>);
        break;
      case "BLOCK_COMMENT":
        const comment = parseComment(lexer, token as Token<any>);
        if (!comment) return;
        parts.push(comment);
        break;
      default:
        parts.push(new SelectorSection(token as Token<any>));
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
