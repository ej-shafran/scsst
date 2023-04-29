import { Loc } from "../tokenize";

import { Node } from "./Node";

export class Stylesheet {
  readonly type = "STYLESHEET";

  constructor(public loc: Loc, public children: Node[]) { }
}
