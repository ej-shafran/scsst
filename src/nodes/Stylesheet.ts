import { Loc } from "../tokenize";
import { Block } from "./Block";
import { Comment } from "./Comment";
import { Declaration } from "./Declaration";
import { FunctionCall } from "./FunctionCall";
import { MediaQuery } from "./MediaQuery";

import { Rule } from "./Rule";
import { Selector } from "./Selector";
import { SelectorList } from "./SelectorList";
import { SelectorSection } from "./SelectorSection";
import { Value } from "./Value";

export type StylesheetChild =
  | Block
  | Comment
  | Declaration
  | FunctionCall
  | MediaQuery
  | Rule
  | Selector
  | SelectorList
  | SelectorSection
  | Value;

export class Stylesheet {
  readonly type = "STYLESHEET";

  constructor(public loc: Loc, public children: StylesheetChild[]) { }

  toString() {
    return this.children.map((child) => child.toString()).join("\n");
  }
}
