import { Loc, TokenOf } from "../tokenize";
import { Selector } from "./Selector";

export class SelectorList {
  readonly type = "SELECTOR_LIST";

  constructor(
    public children: Selector[],
    public loc: Loc,
    private _endToken: TokenOf<"OCURLY">
  ) { }

  getEndToken() {
    return this._endToken;
  }

  toString() {
    return this.children.map((child) => child.toString()).join(", ");
  }
}
