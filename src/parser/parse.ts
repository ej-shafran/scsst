import { Node, Stylesheet } from "../nodes";
import { Lexer } from "../tokenize";
import { parseMediaQuery } from "./parseMediaQuery";
import { parseRule } from "./parseRule";

export function parse(source: string, filePath?: string): Stylesheet {
  const lexer = new Lexer(source, filePath ?? "<unknown>");
  const originalLoc = lexer.loc();

  const rules: Exclude<Node, Stylesheet>[] = [];

  while (lexer.isNotEmpty()) {
    const next = lexer.parseNext();

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
        return new Stylesheet(originalLoc, rules);
    }
  }

  return new Stylesheet(originalLoc, rules);
}
