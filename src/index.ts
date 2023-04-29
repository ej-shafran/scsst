import * as fs from "fs";

import { Lexer, Token, TokenType, report } from "./tokenize";
import { Node, ParserError, expect } from "./parser";
import { Stylesheet, Comment } from "./parser/nodes";
import { parseComment } from "./parser/parse";
import { SelectorPart } from "./parser/nodes/SelectorPart";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  let comment = parseComment(lexer);
  const comments = [comment];

  while (lexer.isNotEmpty()) {
    comment = parseComment(lexer);
    comments.push(comment);
  }

  return comments.filter((item): item is Comment => !!item);
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

function parseSelector(lexer: Lexer, priorToken?: any, isNested?: boolean) {
  let token = expect(lexer, ...(isNested ? nested : common));

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const parts: SelectorPart[] = [];

  let isPsudeo = false;

  while (token.type !== "OCURLY") {
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
      default:
        parts.push(new SelectorPart(token as Token<any>));
        break;
      // case TokenType.OCURLY:
      //   break; // start parsing block
    }

    token = expect(lexer, ...(isNested ? nested : active));

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }
  }

  return parts;
}

// const sheet = new Stylesheet(lexer.loc(), parse(lexer));
//
// console.log(sheet);
const parts = parseSelector(lexer);
console.log(parts);
