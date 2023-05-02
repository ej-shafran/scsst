import { Node, Stylesheet } from "../nodes";
import { Lexer } from "../tokenize";
import { parseAtRule } from "./parseAtRule";
import { parseMediaQuery } from "./parseMediaQuery";
import { parseRule } from "./parseRule";

export function parse(source: string, filePath?: string): Stylesheet {
  const lexer = new Lexer(source, filePath ?? "<unknown>");
  const originalLoc = lexer.loc();

  const rules: Exclude<Node, Stylesheet>[] = [];

  while (lexer.isNotEmpty()) {
    const next = lexer.parseNext();

    switch (next) {
      case "MEDIA_QUERY":
        rules.push(parseMediaQuery(lexer));
        break;
      case "RULE":
        rules.push(parseRule(lexer));
        break;
      case "AT_RULE":
        rules.push(parseAtRule(lexer));
        break;
      case "END":
        return new Stylesheet(originalLoc, rules);
    }
  }

  return new Stylesheet(originalLoc, rules);
}
