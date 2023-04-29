import { Loc } from "../tokenize";
import { Declaration } from "./Declaration";
import { Selector } from "./Selector";

export class Block {
  readonly type = "BLOCK";

  constructor(
    public lines: (Selector | Declaration)[], // TODO: add declarations
    public loc: Loc
  ) { }
}
