import { Loc } from "../../tokenize";
import { Selector } from "./Selector";

export class Block {
  readonly type = "BLOCK";

  constructor(
    public lines: (Selector)[], // TODO: add declarations
    public loc: Loc,
  ) {}
}
