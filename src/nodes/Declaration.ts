import { Loc } from "../tokenize";
import { FunctionCall } from "./FunctionCall";

export class Declaration {
  readonly type = "DECLARATION";

  constructor(public key: string, public children: (string | FunctionCall)[], public loc: Loc) { }
}
