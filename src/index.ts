import * as fs from "fs";

import { Lexer } from "./tokenize";
import { Node } from "./parser";
import { Selector, Stylesheet } from "./parser/nodes";
import {  parseSelector } from "./parser/parse";
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

const sheet = new Stylesheet(lexer.loc(), parse(lexer))
console.log(sheet);
