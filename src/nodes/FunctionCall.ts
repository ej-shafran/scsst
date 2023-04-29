import { Loc } from "../tokenize";

export class FunctionCall {
  readonly type = "FUNCTION_CALL";

  constructor(public name: string, public argList: string[], public loc: Loc) { }

  toString() {
    return `${this.name}(${this.argList.join(",")})` //TODO: deal with space-seperated functions
  }
}
