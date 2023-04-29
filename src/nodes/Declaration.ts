import { Loc } from "../tokenize";
import { FunctionCall } from "./FunctionCall";

export class Declaration {
  readonly type = "DECLARATION";

  constructor(public key: string, public value: string | FunctionCall, public loc: Loc) { }
}
