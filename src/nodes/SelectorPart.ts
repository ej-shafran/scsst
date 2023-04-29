import { Loc, Token } from "../tokenize";

type SelectorPartType =
  | "TAG"
  | "CLASS"
  | "ID"
  | "ATTRIB"
  | "COMBINATOR"
  | "PARENT"
  | "PSEUDO_CLASS";

export class SelectorPart {
  readonly type = "SELECTOR_PART";
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
    if (partType === "ID" || partType === "CLASS") return token.value.slice(1);
    return token.value;
  }

  static extractPartType(
    token: Token<"KEYWORD" | "AMPERSAND" | "ASTERISK" | "RARROW" | "SPACE">,
    isPsudeo: boolean
  ) {
    switch (token.type) {
      case "KEYWORD":
        if (isPsudeo) return "PSEUDO_CLASS";
        return SelectorPart.extractFromKeyword(token as Token<"KEYWORD">);
      case "AMPERSAND":
        return "PARENT";
      default:
        return "COMBINATOR";
    }
  }

  static extractFromKeyword(token: Token<"KEYWORD">) {
    const result = /^(?<identifier>.)/.exec(token.value);

    if (!result) return "TAG";

    switch (result.groups!.identifier) {
      case ".":
        return "CLASS";
      case "#":
        return "ID";
      default:
        return "COMBINATOR";
    }
  }
}
