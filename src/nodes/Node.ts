import { Block } from "./Block";
import { Comment } from "./Comment";
import { Declaration } from "./Declaration";
import { FunctionCall } from "./FunctionCall";
import { MediaQuery } from "./MediaQuery";
import { Rule } from "./Rule";
import { Selector } from "./Selector";
import { SelectorList } from "./SelectorList";
import { SelectorSection } from "./SelectorSection";

export type Node =
  | Block
  | Comment
  | Declaration
  | FunctionCall
  | MediaQuery
  | Rule
  | Selector
  | SelectorList
  | SelectorSection
  | StyleSheet;
