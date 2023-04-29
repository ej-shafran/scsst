import { Loc } from "../tokenize";
import { Comment } from "./Comment";
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

  constructor(parts: (SelectorPart | Comment)[], public loc: Loc) {
    this.specificity = Selector.calculateSpecificity(parts);
    this.content = Selector.buildContent(parts);
  }

  static calculateSpecificity(parts: (SelectorPart | Comment)[]): Specificity {
    const results = {
      id: 0,
      class: 0,
      element: 0,
    };

    for (let part of parts) {
      if ("type" in part) {
        continue;
      } else {
        switch (part.partType) {
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

  static buildContent(parts: (SelectorPart | Comment)[]) {
    let result = "";

    for (let part of parts) {
      result += Selector.contentFor(part);
    }

    return result;
  }

  static contentFor(part: SelectorPart | Comment) {
    if ("type" in part) return part.text;

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
