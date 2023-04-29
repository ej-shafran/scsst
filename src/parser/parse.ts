import { Token, report, Lexer, TokenType } from "../tokenize";

import { ParserError } from "./ParserError";
import { Comment, SelectorList } from "../nodes";
import { Block } from "../nodes/Block";
import { Declaration } from "../nodes/Declaration";
import { Rule } from "../nodes/Rule";
import { NESTED_SELECTOR_TOKENS, parseSelector } from "./parseSelector";
import { parseDeclaration } from "./parseDeclaration";
import { parseComment } from "./parseComment";

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
    token = lexer.expect(
      "CCURLY",
      ...NESTED_SELECTOR_TOKENS.filter((type) => type !== "OCURLY"), // TODO: take out of function
      "SINGLE_LINE_COMMENT"
    );

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
