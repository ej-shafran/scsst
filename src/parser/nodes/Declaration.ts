import { Loc } from "../../tokenize";

export class Declaration {
  readonly type = "DECLARATION";

  constructor(public key: string, public value: string, public loc: Loc) { }
}
