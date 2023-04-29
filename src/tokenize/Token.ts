import { Loc } from "./Loc";
import { createEnum } from "../common/functions";
import { EnumType } from "../common/types";

export const TokenType = createEnum(
  "SINGLE_LINE_COMMENT",
  "MULTI_LINE_COMMENT",
  "KEYWORD",
  "OCURLY",
  "CCURLY",
  "COLON",
  "SEMICOLON",
  "AMPERSAND",
  "RARROW",
  "LARROW",
  "ASTERISK",
  "OPAREN",
  "CPAREN",
  "COMMA"
);
export type TokenType = EnumType<typeof TokenType>;

export const LiteralTokens = {
  "{": TokenType.OCURLY,
  "}": TokenType.CCURLY,
  ":": TokenType.COLON,
  ";": TokenType.SEMICOLON,
  "&": TokenType.AMPERSAND,
  ">": TokenType.RARROW,
  "<": TokenType.LARROW,
  "*": TokenType.ASTERISK,
  "(": TokenType.OPAREN,
  ")": TokenType.CPAREN,
  ",": TokenType.COMMA,
};

export class Token {
  constructor(public type: TokenType, public value: string, public loc: Loc) { }
}
