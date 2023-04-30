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
  ){}

  toString() {
    return `${this.prefix}${this.query?.toString() ?? ""} ${this.block.toString()}`
  }
}
