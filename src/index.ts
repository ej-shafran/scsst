import * as fs from "fs";

import { Lexer } from "./tokenize";
import { Node, Stylesheet } from "./nodes";
import { parseRule } from "./parser";
import { Rule } from "./nodes/Rule";
const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  let rule = parseRule(lexer);
  const rules = [rule];

  while (lexer.isNotEmpty()) {
    rule = parseRule(lexer);
    rules.push(rule);
    console.log(lexer.isEmpty());
  }

  return rules.filter((item): item is Rule => !!item);
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
console.log();
console.log(JSON.stringify(sheet, null, 2));
