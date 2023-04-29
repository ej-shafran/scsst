import { Loc } from "../tokenize";
import { Comment } from "./Comment";
import { FunctionCall } from "./FunctionCall";
import { SelectorPart } from "./SelectorPart";

type Specificity = {
  id: number;
  class: number;
  element: number;
};

export class Selector {
  readonly type = "SELECTOR";
  specificity: Specificity;
  content: string;

  constructor(
    public parts: (SelectorPart | Comment | FunctionCall)[],
    public loc: Loc
  ) {
    this.specificity = Selector.calculateSpecificity(parts);
    this.content = Selector.buildContent(parts);
  }

  static calculateSpecificity(
    parts: (SelectorPart | Comment | FunctionCall)[]
  ): Specificity {
    const results = {
      id: 0,
      class: 0,
      element: 0,
    };

    for (let part of parts) {
      if (part.type === "SELECTOR_PART") {
        switch (
        part.partType // TODO: some renaming here
        ) {
          case "ID":
            results.id++;
            break;
          case "CLASS":
          case "PSEUDO_CLASS":
          case "ATTRIB":
            results.class++;
          case "TAG":
            results.element++;
          case "PARENT":
            break; // TODO: maybe handle this some time?
          case "COMBINATOR":
            break;
        }
      }
    }

    return results;
  }

  static buildContent(parts: (SelectorPart | Comment | FunctionCall)[]) {
    let result = "";

    for (let part of parts) {
      result += Selector.contentFor(part);
    }

    return result;
  }

  static contentFor(part: SelectorPart | Comment | FunctionCall) {
    if (part.type === "COMMENT") return part.text;
    if (part.type === "FUNCTION_CALL") return part.toString();

    switch (part.partType) {
      case "ID":
        return `#${part.content}`;
      case "CLASS":
        return `.${part.content}`;
      case "PSEUDO_CLASS":
        return `:${part.content}`;
      default:
        return part.content;
    }
  }
}
