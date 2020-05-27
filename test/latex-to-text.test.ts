import { latexToText } from "../src/index";
import { sync } from "glob";

import { resolve, basename } from "path";
import * as CSON from "cson";
import { readFileSync } from "fs-extra";

const b = basename(__filename, ".test.ts");
const fixtures = sync(`fixtures/${b}/*.cson`, {
  cwd: resolve(__dirname, ".."),
});

fixtures.forEach((f) => {
  const raw = readFileSync(f, "utf-8");
  const data = CSON.parse(raw);
  console.log(JSON.stringify(data, null, "  "));

  const td = Object.keys(data).reduce((acc, k) => {
    acc.push([k, data[k]]);
    return acc;
  }, []);

  it.each(td)("%s => %s", (input, expected) => {
    const result = latexToText(input);
    expect(result).toEqual(expected);
  });
});
