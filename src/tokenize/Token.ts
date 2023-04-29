import { Loc } from "./Loc";
import { createEnum } from "../common/functions";
import { EnumType } from "../common/types";

export const TokenType = createEnum(
  "SINGLE_LINE_COMMENT",
  "MULTI_LINE_COMMENT",
);
export type TokenType = EnumType<typeof TokenType>;

export class Token {
    constructor(public type: TokenType, public value: string, public loc: Loc) {}
}
