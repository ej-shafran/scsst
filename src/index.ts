import * as fs from "fs";

import { Lexer } from "./tokenize";
import { Node } from "./parser";
import { Stylesheet, Comment } from "./parser/nodes";
import { parseComment } from "./parser/parse";

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

const sheet = new Stylesheet(lexer.loc(), parse(lexer));

console.log(sheet);
