import { Loc } from "../tokenize";
import { Block } from "./Block";
import { SelectorList } from "./SelectorList";

export class Rule {
  readonly type = "RULE";

  constructor(
    public selectorList: SelectorList,
    public block: Block,
    public loc: Loc
  ) { }
}
