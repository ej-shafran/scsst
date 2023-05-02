import { Declaration } from "../nodes/Declaration";
import { Value } from "../nodes/Value";
import { Lexer, TokenOf } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseFunctionCall } from "./parseFunctionCall";
import { safe } from "./safe";

export function parseDeclaration(lexer: Lexer, priorToken?: TokenOf<"KEYWORD">) {
  const keyToken = priorToken ?? lexer.expect("KEYWORD");

  lexer.expect("COLON");

  const values: (Declaration["children"]) = [];

  let token: TokenOf<"KEYWORD" | "SPACE" | "SEMICOLON" | "OPAREN"> = lexer.expect("KEYWORD", "SPACE");
  let latest: TokenOf<"KEYWORD"> | null = null;
  while (token.type !== "SEMICOLON") {
    token = lexer.expect("KEYWORD", "OPAREN", "SPACE", "SEMICOLON");
    switch (token.type) {
      case "KEYWORD":
        if (latest) values.push(new Value(latest.value, latest.loc));
        latest = token;
        break;
      case "OPAREN":
        if (!latest) throw new ParserError("TODO", token.loc);
        const funcCall = parseFunctionCall(lexer, latest.value, latest.loc, token);
        values.push(funcCall);
        latest = null;
        break;
      default:
        if (latest) values.push(new Value(latest.value, latest.loc));
        latest = null;
        break;
    }
  }

  return new Declaration(keyToken.value, values, keyToken.loc);
}

export default safe(parseDeclaration);
