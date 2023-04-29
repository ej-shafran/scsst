import { Loc } from "../tokenize";

export type Node = {
  readonly type: string;
  loc: Loc;
  children?: Node[];
};
