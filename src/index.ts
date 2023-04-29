import * as fs from "fs";

import { Lexer } from "./tokenize";
import { Node, Stylesheet } from "./nodes";
import { parseMediaQuery } from "./parser/parseMediaQuery";
import { parseRule } from "./parser";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  const rules: Node[] = [];

  while (lexer.isNotEmpty()) {
    const next = lexer.parseNext();
    console.log(next);

    let rule: Node | undefined;
    switch (next) {
      case "MEDIA_QUERY":
        rule = parseMediaQuery(lexer);
        if (rule) rules.push(rule);
        break;
      case "RULE":
        rule = parseRule(lexer);
        if (rule) rules.push(rule);
        break;
      case "IMPORT_CALL":
        break; //TODO
      case "END":
        return rules;
    }
  }

  return rules;
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
console.log();
fs.writeFileSync("test.json", JSON.stringify(sheet, null, 2));
