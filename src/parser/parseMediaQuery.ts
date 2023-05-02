import { Declaration } from "../nodes/Declaration";
import { MediaQuery } from "../nodes/MediaQuery";
import { Lexer, Token, TokenOf } from "../tokenize";
import { parseBlock } from "./parseBlock";
import { parseDeclaration } from "./parseDeclaration";
import { MIDLINE_SELECTOR_TOKENS, SelectorToken } from "./parseSelectorList";

export function parseMediaQuery(lexer: Lexer, priorToken?: Token<"KEYWORD">) {
  let token: TokenOf<SelectorToken> = priorToken ?? lexer.expect("KEYWORD");
  const originalLoc = token.loc;

  let prefix = token.value;
  let query: Declaration | null = null;

  while (token.type !== "OCURLY") {
    switch (token.type) {
      case "OPAREN":
        break;
    }

    if (token.type === "OPAREN") {
      query = parseDeclaration(lexer, undefined, "CPAREN");
    } else {
      prefix += token.value;
    }

    token = lexer.expect(...MIDLINE_SELECTOR_TOKENS);
  }

  const block = parseBlock(lexer, token);

  return new MediaQuery(prefix, query, block, originalLoc);
}
