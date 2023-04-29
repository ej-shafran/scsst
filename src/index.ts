import { Lexer, report } from "./tokenize";
import * as fs from "fs";
import { Node } from "./parser";
import { Stylesheet } from "./parser/nodes/Stylesheet";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

function parse(lexer: Lexer): Node[] {
  const token = lexer.nextToken();

  if (!token) return [] as any; //TODO

  switch (token.type) {
    
  }

  return {} as any;
}

const sheet = new Stylesheet(lexer.loc(), parse(lexer));
