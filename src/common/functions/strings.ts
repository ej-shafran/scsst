export function isWhitespace(char: string) {
  return /\s/.test(char);
}

export function startsSelector(char: string) {
  return /[.#a-zA-Z]{1}/.test(char);
}

export function selectorEnd(char: string) {
  return isWhitespace(char) || /[.#[]/.test(char);
}
