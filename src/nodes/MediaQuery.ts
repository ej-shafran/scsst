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
    let queryString = this.query?.toString()?.replace(/;$/, "")?.trim();
    queryString = queryString ? `(${queryString})` : "";
    return `${repeat(" ", this.loc.col - 1)}${this.prefix
      }${queryString} ${this.block.toString()}`;
  }
}
