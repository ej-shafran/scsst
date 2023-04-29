import { Lexer } from "./tokenize/Lexer";
import * as fs from "fs";
import { report } from "./tokenize/report";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath);

for (let token of lexer) {
  report(`${JSON.stringify(token.value)}, ${token.type}`, token.loc);
}
