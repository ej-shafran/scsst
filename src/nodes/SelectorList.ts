import { Loc } from "../tokenize";
import { Selector } from "./Selector";

export class SelectorList {
  readonly type = "SELECTOR_LIST";

  constructor(public children: Selector[], public loc: Loc) { }

  toString() {
    return this.children.map((child) => child.toString()).join(", ");
  }
}
