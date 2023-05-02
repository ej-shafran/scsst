import { report } from "../tokenize";
import { ParserError } from "./ParserError";

export function safe<TFunc extends (...args: any[]) => any>(parser: TFunc) {
  return function(...args: Parameters<TFunc>): ReturnType<TFunc> | undefined {
    try {
      return parser(...args);
    } catch (error) {
      if (error && error instanceof ParserError) {
        report(error.message, error.loc);
        return;
      }

      throw error;
    }
  };
}
