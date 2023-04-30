import { Node, Rule } from "../nodes";

export type ChildOf<TNode extends Node> = TNode["children"] extends Node[]
  ? TNode["children"][number]
  : TNode extends Rule
  ? TNode["block"] | TNode["selectorList"]
  : null;

export function walk<TNode extends Node = Node>(
  node: TNode,
  visitor: (node: ChildOf<TNode>) => void | "BREAK"
) {
  const result = visitor(node as any);

  if (result === "BREAK") return;

  node.children?.forEach((child) => {
    walk(child as any, visitor);
  });

  if (node.type === "RULE") {
    walk(node.selectorList as any, visitor);
    walk(node.block as any, visitor);
  }
}
