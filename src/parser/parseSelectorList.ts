import { Selector, SelectorList, SelectorSection } from "../nodes";
import { Lexer, Loc, Token } from "../tokenize";
import { TokenOf } from "../tokenize/Token";
import { ParserError } from "./ParserError";
import { parseComment } from "./parseComment";
import { parseFunctionCall } from "./parseFunctionCall";

const COMMON_SELECTOR_TOKENS = [
  "KEYWORD",
  "ASTERISK",
  "COLON",
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

export type SelectorToken = (typeof NESTED_SELECTOR_TOKENS)[number];

export function parseSelectorList(
  lexer: Lexer,
  priorToken?: TokenOf<SelectorToken>,
  isNested?: boolean
) {
  let token =
    priorToken ??
    lexer.expect(
      ...(isNested ? NESTED_SELECTOR_TOKENS : COMMON_SELECTOR_TOKENS)
    );

  const selectors: Selector[] = [];

  const originalLoc = token.loc;

  let currentLoc: Loc | null = token.loc;
  let children: (Selector["children"]) = [];
  let isPsudeo = false;
  let pendingSpace: SelectorSection | null = null;

  while (token.type !== "OCURLY") {
    if (currentLoc === null) currentLoc = token.loc;

    if (pendingSpace) {
      children.push(pendingSpace);
      pendingSpace = null;
    }

    switch (token.type) {
      case "KEYWORD":
        children.push(new SelectorSection(token, isPsudeo));
        isPsudeo = false;
        break;
      case "OPAREN":
        const lastPart = children.pop();
        if (!lastPart) throw new ParserError("TODO", token.loc);
        const funcCall = parseFunctionCall(lexer, Selector.contentFor(lastPart), lastPart.loc, token);
        children.push(funcCall);
        break;
      case "SPACE":
        pendingSpace = new SelectorSection(token);
        break;
      case "BLOCK_COMMENT":
        const comment = parseComment(lexer, token as Token<any>);
        children.push(comment);
        break;
      case "COLON":
        isPsudeo = true;
        break;
      case "COMMA":
        selectors.push(new Selector(children, currentLoc));
        children = [];
        isPsudeo = false;
        pendingSpace = null;
        currentLoc = null;
        break;
      default:
        children.push(new SelectorSection(token));
        break;
    }

    token = lexer.expect(
      ...(isNested ? NESTED_SELECTOR_TOKENS : MIDLINE_SELECTOR_TOKENS)
    );
  }

  return new SelectorList(selectors, originalLoc, token);
}

