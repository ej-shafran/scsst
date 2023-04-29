import * as fs from "fs";

import { Lexer } from "./tokenize";
import { Node, Stylesheet, Block } from "./nodes";
import { parseBlock } from "./parser/parse";
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
