import { Loc } from "../tokenize";
import { Block } from "./Block";
import { Selector } from "./Selector";

export class Rule {
  readonly type = "RULE";

  constructor(
    public selector: Selector,
    public block: Block,
    public loc: Loc
  ) { }
}
