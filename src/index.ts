import * as fs from "fs";

import { Lexer, Token, TokenType, report } from "./tokenize";
import { Node, ParserError } from "./parser";
import { Selector, Stylesheet } from "./parser/nodes";
import { parseSelector, parseDeclaration } from "./parser/parse";
import { Declaration } from "./parser/nodes/Declaration";
const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  let declaration = parseDeclaration(lexer);
  const declarations = [declaration];

  while (lexer.isNotEmpty()) {
    declaration = parseDeclaration(lexer);
    declarations.push(declaration);
  }

  return declarations.filter((item): item is Declaration => !!item);
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
console.log(sheet);
