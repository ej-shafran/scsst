import { Loc } from "./Loc";

export function report(message: unknown, loc: Loc) {
  console.log(`${loc.toString()}: ${message}`);
}
