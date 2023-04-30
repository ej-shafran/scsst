import { Token, Lexer } from "../tokenize";

import { SelectorList } from "../nodes";
import { Rule } from "../nodes/Rule";
import { NESTED_SELECTOR_TOKENS, parseSelector } from "./parseSelector";
import { parseBlock } from "./parseBlock";

export function parseRule(
  lexer: Lexer,
  priorToken?: Token<(typeof NESTED_SELECTOR_TOKENS)[number]>,
  isNested?: boolean
) {
  let result = parseSelector(lexer, priorToken, isNested);
  if (!result) return;

  const originalLoc = result.selector.loc;

  const selectors = [result.selector];
  let token = result.token;

  while (token.type !== "OCURLY") {
    result = parseSelector(lexer, undefined, isNested);
    if (!result) return;

    selectors.push(result.selector);
    token = result.token;
  }

  const selectorList = new SelectorList(selectors, originalLoc);
  const block = parseBlock(lexer, token as Token<"OCURLY">);
  if (!block) return;

  return new Rule(selectorList, block, originalLoc);
}
