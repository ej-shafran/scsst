export function isWhitespace(char: string) {
  return /\s/.test(char);
}

export function startsKeyword(char: string) {
  return /[.#$a-zA-Z0-9\-@]{1}/.test(char);
}

export function endsKeyword(char: string) {
  return isWhitespace(char) || /[.#[:;(),]/.test(char);
}
