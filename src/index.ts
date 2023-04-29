import { Lexer, report } from "./tokenize";
import * as fs from "fs";
import { Node, ParserError, expect } from "./parser";
import { Stylesheet } from "./parser/nodes/Stylesheet";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  const token = expect(lexer, "SINGLE_LINE_COMMENT");

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return [];
  }

  return [token];
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));

console.log(sheet);
