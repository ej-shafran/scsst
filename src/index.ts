import * as fs from "fs";

import { Lexer, Token, TokenType, report } from "./tokenize";
import { Node, ParserError } from "./parser";
import { Selector, Stylesheet } from "./parser/nodes";
import { parseSelector } from "./parser/parse";
const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  let selector = parseSelector(lexer);
  const selectors = [selector];

  while (lexer.isNotEmpty()) {
    selector = parseSelector(lexer);
    selectors.push(selector);
  }

  return selectors.filter((item): item is Selector => !!item);
}

// function parseBlock(lexer: Lexer, priorToken?: Token<"OCURLY">) {
//   let token: Token<TokenType> | ParserError =
//     priorToken ?? expect(lexer, TokenType.OCURLY);
//
//   if (token instanceof ParserError) {
//     report(token.message, token.loc);
//     return;
//   }
//
//   while (token.type !== "CCURLY") {
//     token = expect(lexer);
//   }
// }

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
console.log(sheet);
