import { Loc } from "../tokenize";

export class Value {
  readonly type = "VALUE";
  children = null;

  constructor(public content: string, public loc: Loc) { }

  toString() {
    return this.content;
  }
}
