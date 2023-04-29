import * as fs from "fs";

import { Lexer, Token, TokenType, report } from "./tokenize";
import { Node, ParserError } from "./parser";
import { Selector, Stylesheet } from "./parser/nodes";
import { parseSelector, parseDeclaration, parseBlock } from "./parser/parse";
import { Declaration } from "./parser/nodes/Declaration";
import { Block } from "./parser/nodes/Block";
const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  let block = parseBlock(lexer);
  const blocks = [block];

  while (lexer.isNotEmpty()) {
    block = parseBlock(lexer);
    blocks.push(block);
  }

  return blocks.filter((item): item is Block => !!item);
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
console.log();
console.log(JSON.stringify(sheet, null, 2));
