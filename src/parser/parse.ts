import { Token, TokenType, report, Lexer } from "../tokenize";

import { ParserError } from "./ParserError";
import { Comment, Selector, SelectorPart } from "./nodes";

export function parseComment(
  lexer: Lexer,
  priorToken?: Token<"SINGLE_LINE_COMMENT" | "BLOCK_COMMENT">
) {
  const token =
    priorToken ??
    lexer.expect(TokenType.SINGLE_LINE_COMMENT, TokenType.BLOCK_COMMENT);

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  return new Comment(token);
}

const common = [
  TokenType.KEYWORD,
  TokenType.ASTERISK,
  TokenType.COLON, // psuedo classes
] as const;

const active = [
  ...common,
  TokenType.OPAREN,
  TokenType.COMMA,
  TokenType.RARROW,
  TokenType.LARROW,
  TokenType.OCURLY,
  TokenType.SPACE,
] as const;

const nested = [...active, TokenType.AMPERSAND] as const;

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
      case TokenType.KEYWORD:
        parts.push(new SelectorPart(token as Token<any>, isPsudeo));
        isPsudeo = false;
        break;
      case TokenType.COLON:
        isPsudeo = true;
        break;
      case TokenType.OPAREN:
        break; // parse a function call
      case TokenType.COMMA:
        break; // parse next selector
      case TokenType.SPACE:
        pendingSpace = new SelectorPart(token as Token<any>);
        break;
      default:
        parts.push(new SelectorPart(token as Token<any>));
        break;
      // case TokenType.OCURLY:
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
