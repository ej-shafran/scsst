import { Token, report, Lexer, TokenType } from "../tokenize";

import { ParserError } from "./ParserError";
import { Comment, Selector, SelectorPart } from "../nodes";
import { Block } from "../nodes/Block";
import { Declaration } from "../nodes/Declaration";
import { Rule } from "../nodes/Rule";

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

const COMMON_SELECTOR_TOKENS = [
  "KEYWORD",
  "ASTERISK",
  "COLON", // psuedo classes
] as const;

const MIDLINE_SELECTOR_TOKENS = [
  ...COMMON_SELECTOR_TOKENS,
  "OPAREN",
  "COMMA",
  "RARROW",
  "LARROW",
  "OCURLY",
  "SPACE",
] as const;

const NESTED_SELECTOR_TOKENS = [
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
    }

    token = lexer.expect(
      ...(isNested ? NESTED_SELECTOR_TOKENS : MIDLINE_SELECTOR_TOKENS)
    );

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }
  }

  return new Selector(parts, originalLoc);
}

export function parseDeclaration(lexer: Lexer, priorToken?: Token<"KEYWORD">) {
  const keyToken = priorToken ?? lexer.expect("KEYWORD");

  if (keyToken instanceof ParserError) {
    report(keyToken.message, keyToken.loc);
    return;
  }

  let error: Token<TokenType> | ParserError = lexer.expect("COLON");

  if (error instanceof ParserError) {
    report(error.message, error.loc);
    return;
  }

  const valueToken = lexer.expect("KEYWORD");

  if (valueToken instanceof ParserError) {
    report(valueToken.message, valueToken.loc);
    return;
  }

  error = lexer.expect("SEMICOLON"); // TODO: deal with functions

  if (error instanceof ParserError) {
    report(error.message, error.loc);
    return;
  }

  return new Declaration(keyToken.value, valueToken.value, keyToken.loc);
}

export function parseBlock(lexer: Lexer, priorToken?: Token<"OCURLY">) {
  let token: Token<TokenType> | ParserError =
    priorToken ?? lexer.expect("OCURLY");

  const originalLoc = token.loc;

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const lines: (Selector | Declaration)[] = [];

  while (token.type !== "CCURLY") {
    token = lexer.expect(
      "CCURLY",
      ...NESTED_SELECTOR_TOKENS.filter((type) => type !== "OCURLY") // TODO: take out of function
    );

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }

    if (token.type !== "CCURLY") {
      const toParse = lexer.isSelectorOrDeclaration();

      if (toParse == "selector") {
        const selector = parseSelector(lexer, token as Token<any>, true); // TODO: change to rule
        if (selector) lines.push(selector);
      } else {
        const declaration = parseDeclaration(lexer, token as Token<"KEYWORD">);
        if (declaration) lines.push(declaration);
      }
    }
  }

  return new Block(lines, originalLoc);
}

export function parseRule(lexer: Lexer, priorToken?: Token<any> /*TODO*/) {
  const selector = parseSelector(lexer, priorToken);
  const block = parseBlock(lexer);

  if (!selector || !block) return;

  return new Rule(selector, block, priorToken?.loc ?? selector.loc);
}
