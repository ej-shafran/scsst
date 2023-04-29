import { Loc } from "../tokenize";
import { Comment } from "./Comment";
import { FunctionCall } from "./FunctionCall";
import { SelectorSection } from "./SelectorSection";

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
    public children: (SelectorSection | Comment | FunctionCall)[],
    public loc: Loc
  ) {
    this.specificity = Selector.calculateSpecificity(children);
    this.content = Selector.buildContent(children);
  }

  static calculateSpecificity(
    parts: (SelectorSection | Comment | FunctionCall)[]
  ): Specificity {
    const results = {
      id: 0,
      class: 0,
      element: 0,
    };

    for (let section of parts) {
      if (section.type === "SELECTOR_SECTION") {
        switch (section.variant) {
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

  static buildContent(parts: (SelectorSection | Comment | FunctionCall)[]) {
    let result = "";

    for (let part of parts) {
      result += Selector.contentFor(part);
    }

    return result;
  }

  static contentFor(part: SelectorSection | Comment | FunctionCall) {
    if (part.type === "COMMENT") return part.text;
    if (part.type === "FUNCTION_CALL") return part.toString();

    switch (part.variant) {
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
