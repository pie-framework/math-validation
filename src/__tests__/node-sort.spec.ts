import { sort, flatten } from "../node-sort";
import { parse, simplify } from "mathjs";

const simpleAddition = [
  // ["a + b", "a + b"],
  ["b + a", "a + b"],
  // ["a + b + c", "a + b + c"],
  ["b + c + a", "a + b + c"],
  ["b + a + c", "a + b + c"],
  ["c + b + a", "a + b + c"],

  // normalize comparatives too - always use greater than
  // ["b < a", "a > b"],
  // ["b <= a", "a >= b"],
  // ["a + (c + b)", "a + (b + c)"],
];

// ${["+", "1", ["+", "2"]]} | ${["+", "1", "2"]}
// ${["+", "1", ["*", "2"]]} | ${["+", "1", ["*", "2"]]}
// ${["+", ["+", ["+", "1", "2"]], "3"]} | ${["+", "1", "2", "3"]}
// ${["+", ["+", ["*", "1", "2"]], "3"]} | ${["+", ["*", "1", "2"], "3"]}
// it.each`
//   input                | expected
//   ${["+", ["+", "1"]]} | ${["+", "1"]}
// `("", ({ input, expected }) => {
//   const result = flatten(input);
//   console.log("result:", result);
//   expect(result).toEqual(expected);
// });

const tester = (input, expected) => {
  it("sorts", () => {
    const i = parse(input);
    const e = parse(expected);
    const result = sort(simplify(i));

    // console.log("result.json", JSON.stringify(result, null, "  "));
    // console.log("e.json", JSON.stringify(e, null, "  "));
    // console.log("result:", result.toString(), "expected:", e.toString());
    expect(simplify(e).equals(simplify(result))).toBe(true);
  });
};
describe.each(simpleAddition)("%o => %o", tester);
