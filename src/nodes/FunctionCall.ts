import { Value } from "./Value";
import { Loc } from "../tokenize";

export class FunctionCall {
  readonly type = "FUNCTION_CALL";

  constructor(public name: string, public children: Value[], public loc: Loc) { }

  toString() {
    return `${this.name}(${this.children
      .map((value) => value.content)
      .join(", ")})`; //TODO: deal with space-seperated functions
  }
}
