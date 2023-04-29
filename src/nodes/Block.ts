import { Loc } from "../tokenize";
import { Comment } from "./Comment";
import { Declaration } from "./Declaration";
import { Rule } from "./Rule";

export class Block {
  readonly type = "BLOCK";

  constructor(
    public lines: (Rule | Declaration | Comment)[],
    public loc: Loc
  ) { }
}
