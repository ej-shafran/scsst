import { createEnum } from "../common/functions";
import { EnumType } from "../common/types";

import { Loc } from "./Loc";

export const TokenType = createEnum(
  "SINGLE_LINE_COMMENT",
  "BLOCK_COMMENT",
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
  "COMMA",
  "SPACE",
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

export class Token<TType extends TokenType> {
  constructor(public type: TType, public value: string, public loc: Loc) { }
}
