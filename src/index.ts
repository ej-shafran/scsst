import { Lexer } from './tokenize/Lexer';
import * as fs from 'fs';

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const lexer = new Lexer(source, filePath)

for (let token of lexer) {
  console.log(token);
}
