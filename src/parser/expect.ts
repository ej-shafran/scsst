import { Lexer, Loc, Token, TokenType } from "../tokenize";

export class ParserError {
  constructor(public message: string, public loc: Loc) { }
}

function joinTypes(types: TokenType[]) {
  if (!types.length) return "a token";
  if (types.length === 1) return types[0];

  let result = "";
  for (let i = 0; i < types.length - 1; i++) {
    result += types[i] + ", ";
  }

  return result + " or " + types.at(-1)!;
}

export function expect<TTypes extends TokenType[]>(
  lexer: Lexer,
  ...types: TTypes
): ParserError | Token<TTypes[number]> {
  const originalLoc = lexer.loc();
  const token = lexer.nextToken();

  if (!token) {
    return new ParserError(
      `Expected ${joinTypes(types)} but reached end of file`,
      originalLoc
    );
  }

  if (!types.includes(token.type)) {
    return new ParserError(
      `Expected ${joinTypes(types)} but got ${token.type}`,
      token.loc
    );
  }

  return token;
}
