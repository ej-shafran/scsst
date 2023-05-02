import { Node, Stylesheet } from "../nodes";
import { Lexer } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseAtRule } from "./parseAtRule";
import { parseMediaQuery } from "./parseMediaQuery";
import { parseRule } from "./parseRule";

export function parse(source: string, filePath = "<unknown>"): Stylesheet {
  const lexer = new Lexer(source, filePath);
  const originalLoc = lexer.loc();

  const rules: Exclude<Node, Stylesheet>[] = [];

  try {
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
  } catch (error) {
    if (error instanceof ParserError) {
      console.error(`${error.loc.toString()}: ${error.message}`);
    } else throw error;
  }

  return new Stylesheet(originalLoc, rules);
}
