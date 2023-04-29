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

  constructor(parts: SelectorPart[]) {
    this.specificity = Selector.calculateSpecificity(parts);
    this.content = Selector.buildContent(parts);
  }

  static calculateSpecificity(parts: SelectorPart[]): Specificity {
    const results = {
      id: 0,
      class: 0,
      element: 0,
    };

    for (let part of parts) {
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

    return results;
  }

  static buildContent(parts: SelectorPart[]) {
    let result = "";

    for (let part of parts) {
      result += Selector.contentFor(part);
    }

    return result;
  }

  static contentFor(part: SelectorPart) {
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
