import { Loc } from "../tokenize";

export class AtRule {
  readonly type = "AT_RULE";
  children = null;

  constructor(public content: string, public loc: Loc) { }

  toString() {
    return this.content + ";";
  }
}
