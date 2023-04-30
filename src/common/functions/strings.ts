export function isWhitespace(char: string) {
  return /\s/.test(char);
}

export function startsKeyword(char: string) {
  return /[.#$a-zA-Z0-9\-@"]{1}/.test(char);
}

export function endsKeyword(char: string, hasNumber?: boolean) {
  return (
    isWhitespace(char) || (hasNumber ? /[#[:;(),]/ : /[.#[:;(),]/).test(char)
  );
}

export function repeat(str: string, amount: number) {
  let result = "";
  for (let i = 0; i < amount; i++) {
    result += str;
  }
  return result;
}
