import { Loc } from "./Loc";

export type TokenType =
  | "SINGLE_LINE_COMMENT"
  | "BLOCK_COMMENT"
  | "KEYWORD"
  | "OCURLY"
  | "CCURLY"
  | "COLON"
  | "SEMICOLON"
  | "AMPERSAND"
  | "RARROW"
  | "LARROW"
  | "ASTERISK"
  | "OPAREN"
  | "CPAREN"
  | "COMMA"
  | "SPACE";

export const LiteralTokens = {
  "{": "OCURLY",
  "}": "CCURLY",
  ":": "COLON",
  ";": "SEMICOLON",
  "&": "AMPERSAND",
  ">": "RARROW",
  "<": "LARROW",
  "*": "ASTERISK",
  "(": "OPAREN",
  ")": "CPAREN",
  ",": "COMMA",
} as const;

export class Token<TType extends TokenType> {
  constructor(public type: TType, public value: string, public loc: Loc) { }
}
