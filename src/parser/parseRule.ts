import { Lexer, TokenOf } from "../tokenize";
import { Rule } from "../nodes/Rule";
import { SelectorToken, parseSelectorList } from "./parseSelectorList";
import { parseBlock } from "./parseBlock";
import { safe } from "./safe";

export function parseRule(
  lexer: Lexer,
  priorToken?: TokenOf<SelectorToken>,
  isNested?: boolean
) {
  const selectorList = parseSelectorList(lexer, priorToken, isNested);
  const block = parseBlock(lexer, selectorList.getEndToken());
  return new Rule(selectorList, block, selectorList.loc);
}

export default safe(parseRule);
