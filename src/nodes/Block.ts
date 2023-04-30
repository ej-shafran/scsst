import { Loc } from "../tokenize";
import { AtRule } from "./AtRule";
import { Comment } from "./Comment";
import { Declaration } from "./Declaration";
import { Rule } from "./Rule";
import { Value } from "./Value";

export class Block {
  readonly type = "BLOCK";

  constructor(
    public children: (Rule | Declaration | Comment | Value | AtRule)[],
    public loc: Loc
  ) { }

  toString(endPad?: string) {
    return `{\n${this.children.map((child) => child.toString()).join("\n")}\n${endPad ?? ""
      }}`;
  }
}
