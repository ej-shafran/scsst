// export * from "./parser";
// export * from "./nodes";
// export * from "./tokenize";

import * as fs from "fs";
import { parse } from "./parser";

const filePath = "test.scss";
const source = fs.readFileSync(filePath, "utf-8");

const tree = parse(source, filePath);
fs.writeFileSync("test.json", JSON.stringify(tree, null, 2));
