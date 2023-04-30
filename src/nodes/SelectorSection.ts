import { Loc, Token } from "../tokenize";

export type SelectorSectionVariant =
  | "TAG"
  | "CLASS"
  | "ID"
  | "ATTRIB"
  | "COMBINATOR"
  | "PARENT"
  | "PSEUDO_CLASS";

export class SelectorSection {
  readonly type = "SELECTOR_SECTION";
  variant: SelectorSectionVariant;
  content: string;
  loc: Loc;
  children = null;

  constructor(
    token: Token<"KEYWORD" | "AMPERSAND" | "ASTERISK" | "RARROW" | "SPACE">,
    isPsudeo = false
  ) {
    this.loc = token.loc;
    this.variant = SelectorSection.extractPartType(token, isPsudeo);
    this.content = SelectorSection.extractContent(token, this.variant);
  }

  toString() {
    return this.content;
  }

  static extractContent(token: Token<any>, partType: SelectorSectionVariant) {
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
        return SelectorSection.extractFromKeyword(token as Token<"KEYWORD">);
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
