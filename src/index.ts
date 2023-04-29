import { Lexer, TokenType, report } from "./tokenize";
import * as fs from "fs";
import { Node, ParserError, expect } from "./parser";
import { Stylesheet, Comment } from "./parser/nodes";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  return [parseComment(lexer)].filter((item): item is Comment => !!item);
}

function parseComment(lexer: Lexer) {
  const token = expect(
    lexer,
    TokenType.SINGLE_LINE_COMMENT,
    TokenType.MULTI_LINE_COMMENT
  );

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  return new Comment(token);
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));

console.log(sheet);
