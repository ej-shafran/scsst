import { repeat } from "../common/functions";
import { Loc } from "../tokenize";
import { Block } from "./Block";
import { Declaration } from "./Declaration";

export class MediaQuery {
  readonly type = "MEDIA_QUERY";
  children = null;

  constructor(
    public prefix: string,
    public query: Declaration | null,
    public block: Block,
    public loc: Loc
  ) { }

  toString() {
    return `${repeat(" ", this.loc.col - 1)}${this.prefix}${this.query?.toString() ?? ""
      } ${this.block.toString()}`;
  }
}
