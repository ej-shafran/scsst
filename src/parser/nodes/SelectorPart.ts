import { createEnum } from "../../common/functions";
import { EnumType } from "../../common/types";
import { Loc, Token, TokenType } from "../../tokenize";

const SelectorPartType = createEnum(
  "TAG",
  "CLASS",
  "ID",
  "ATTRIB",
  "COMBINATOR",
  "PARENT",
  "PSEUDO_CLASS"
);
type SelectorPartType = EnumType<typeof SelectorPartType>;

export class SelectorPart {
  readonly type = "SELECTOR";
  partType: SelectorPartType;
  content: string;
  loc: Loc;

  constructor(
    token: Token<"KEYWORD" | "AMPERSAND" | "ASTERISK" | "RARROW" | "SPACE">,
    isPsudeo = false
  ) {
    this.loc = token.loc;
    this.partType = SelectorPart.extractPartType(token, isPsudeo);
    this.content = SelectorPart.extractContent(token, this.partType);
  }

  static extractContent(token: Token<any>, partType: SelectorPartType) {
    if (partType === SelectorPartType.ID || partType === SelectorPartType.CLASS)
      return token.value.slice(1);
    return token.value;
  }

  static extractPartType(
    token: Token<"KEYWORD" | "AMPERSAND" | "ASTERISK" | "RARROW" | "SPACE">,
    isPsudeo: boolean
  ) {
    switch (token.type) {
      case TokenType.KEYWORD:
        if (isPsudeo) return SelectorPartType.PSEUDO_CLASS; // TODO: handle other cases?
        return SelectorPart.extractFromKeyword(token as Token<"KEYWORD">);
      case TokenType.AMPERSAND:
        return SelectorPartType.PARENT;
      default:
        return SelectorPartType.COMBINATOR;
    }
  }

  static extractFromKeyword(token: Token<"KEYWORD">) {
    const result = /^(?<identifier>.)/.exec(token.value);

    if (!result) return SelectorPartType.TAG;

    switch (result.groups!.identifier) {
      case ".":
        return SelectorPartType.CLASS;
      case "#":
        return SelectorPartType.ID;
      default:
        return SelectorPartType.COMBINATOR;
    }
  }
}
