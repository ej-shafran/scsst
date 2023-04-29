import { Loc } from "../tokenize";

export class FunctionCall {
  readonly type = "FUNCTION_CALL";

  constructor(public name: string, public children: string[], public loc: Loc) { }

  toString() {
    return `${this.name}(${this.children.join(",")})` //TODO: deal with space-seperated functions
  }
}
