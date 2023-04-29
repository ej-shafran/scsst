import { TokenType } from "../../tokenize";

export function joinTypes(types: TokenType[]) {
  if (!types.length) return "a token";
  if (types.length === 1) return types[0];

  let result = "";
  for (let i = 0; i < types.length - 1; i++) {
    result += types[i] + (i === types.length - 2 ? "" : ", ");
  }

  return result + " or " + types.at(-1)!;
}
