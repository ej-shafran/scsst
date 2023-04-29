import { Loc } from "../tokenize";

export class ParserError {
  constructor(public message: string, public loc: Loc) { }
}
