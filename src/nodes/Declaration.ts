import { repeat } from "../common/functions";
import { Loc } from "../tokenize";
import { FunctionCall } from "./FunctionCall";
import { Value } from "./Value";

export class Declaration {
  readonly type = "DECLARATION";

  constructor(
    public key: string,
    public children: (Value | FunctionCall)[],
    public loc: Loc
  ) { }

  toString() {
    return `${repeat(" ", this.loc.col - 1)}${this.key}: ${this.children
      .map((child) => child.toString())
      .join(" ")}`;
  }
}
