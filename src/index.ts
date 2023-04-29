import { Lexer, Token, TokenType, report } from "./tokenize";
import * as fs from "fs";
import { Node, ParserError, expect } from "./parser";
import { Stylesheet, Comment } from "./parser/nodes";

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

function parseComment(
  lexer: Lexer,
  priorToken?: Token<"SINGLE_LINE_COMMENT" | "BLOCK_COMMENT">
) {
  const token =
    priorToken ??
    expect(lexer, TokenType.SINGLE_LINE_COMMENT, TokenType.BLOCK_COMMENT);

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  return new Comment(token);
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));

console.log(sheet);
