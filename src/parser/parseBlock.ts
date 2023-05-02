import { Block } from "../nodes";
import { Lexer, Token } from "../tokenize";
import { parseRule } from "./parseRule";
import { parseComment } from "./parseComment";
import { parseDeclaration } from "./parseDeclaration";
import { parseAtRule } from "./parseAtRule";
import { TokenOf } from "../tokenize/Token";
import { safe } from "./safe";

const BLOCK_TOKENS = [
  "CCURLY",
  "SINGLE_LINE_COMMENT",
  "KEYWORD",
  "BLOCK_COMMENT",
  "SPACE",
  "RARROW",
  "LARROW",
  "ASTERISK",
  "AMPERSAND",
] as const;
type BlockToken = (typeof BLOCK_TOKENS)[number];

export function parseBlock(lexer: Lexer, priorToken?: TokenOf<"OCURLY">) {
  let token: TokenOf<BlockToken | "OCURLY"> =
    priorToken ?? lexer.expect("OCURLY");

  const originalLoc = token.loc;
  const lines: Block["children"] = [];

  while (token.type !== "CCURLY") {
    token = lexer.expect(...BLOCK_TOKENS);

    switch (token.type) {
      case "SINGLE_LINE_COMMENT":
      case "BLOCK_COMMENT":
        const comment = parseComment(lexer, token);
        lines.push(comment);
        break;
      case "KEYWORD":
        const prediction = lexer.isSelectorOrDeclaration();
        if (prediction === "selector") {
          const rule = parseRule(lexer, token, true);
          lines.push(rule);
        } else if (token.value.startsWith("@")) {
          const atRule = parseAtRule(lexer, token as Token<"KEYWORD">);
          lines.push(atRule);
        } else {
          const declaration = parseDeclaration(lexer, token);
          lines.push(declaration);
        }
        break;
      case "RARROW":
      case "LARROW":
      case "ASTERISK":
      case "AMPERSAND":
        const rule = parseRule(lexer, token, true);
        lines.push(rule);
        break;
      default:
        break;
    }
  }

  return new Block(lines, originalLoc);
}

export default safe(parseBlock);
