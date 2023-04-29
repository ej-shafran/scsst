import * as fs from "fs";

import { Lexer } from "./tokenize";
import { Node, Stylesheet } from "./nodes";
import { parseMediaQuery } from "./parser/parseMediaQuery";
import { MediaQuery } from "./nodes/MediaQuery";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

//TODO: rename things to children

function parse(lexer: Lexer): Node[] {
  let rule = parseMediaQuery(lexer);
  const rules = [rule];

  // TODO: figure out why we hit the end of the file...
  while (lexer.isNotEmpty()) {
    rule = parseMediaQuery(lexer);
    rules.push(rule);
  }

  return rules.filter((item): item is MediaQuery => !!item);
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
console.log();
fs.writeFileSync("test.json", JSON.stringify(sheet, null, 2));
