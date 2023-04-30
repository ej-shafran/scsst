import { repeat } from "../common/functions";
import { Loc } from "../tokenize";
import { Block } from "./Block";
import { SelectorList } from "./SelectorList";

export class Rule {
  readonly type = "RULE";
  children = null;

  constructor(
    public selectorList: SelectorList,
    public block: Block,
    public loc: Loc
  ) { }

  toString(): string {
    const padding = repeat(" ", this.loc.col - 1);
    return `${padding}${this.selectorList.toString()} ${this.block.toString(
      padding
    )}`;
  }
}
