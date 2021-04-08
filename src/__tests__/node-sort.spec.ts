import { sort, flatten } from "../node-sort";
import { parse, simplify } from "mathjs";

const simpleAddition = [
  ["a + b", "a + b"],
  ["b + a", "a + b"],
    ["a * b", "a * b"],
  ["b * a", "a * b"],
  ["b * a + 2", "2 + a * b"],
  //      ["a(b)", "(b)a"],
  // ["ba", "ab"],
  ///["ba + 2", "2 + ab"],
  ["a + b + c", "a + b + c"],
  ["b + c + a", "a + b + c"],
  ["b + a + c", "a + b + c"],

// //normalize comparatives too - always use greater than
  ["A < B", "B > A"],
 ["A < B > c", "c < B < A"],
   ["A > B + 2", "2+ B < A"],
 ["g+b > a > d ", "d < a < b+g"],
// // ["b <= a", "a >= b"],
    ["a + (c + b)", "a + (b + c)"],
 ["a*(c + b)", "(b + c)*a"],
 ["(a+e) + (c + b)", "(e+a) + (b + c)"],

["1+2*(3+4*(5+6*(7+8)))", "(4*((8+7)*6+5)+3)*2+1"],
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
    const i = sort(parse(input));
    const e = parse(expected);
    const opExpected = sort(parse(expected));
    console.log("i", i)
   // console.log("simplify", simplify(i))
   // console.log("sort", sort(simplify(i)))
  //  const result = sort(i);
   // const result = sort(i);

    console.log(i, "result")
    console.log(e, "expected")
   // console.log(simplify(e), "expected")


    // console.log("result.json", JSON.stringify(result, null, "  "));
    // console.log("e.json", JSON.stringify(e, null, "  "));
    // console.log("result:", result.toString(), "expected:", e.toString());

    // console.log("i fn", i.fn, "i", i)
    // if ((i.fn && i.fn == "larger") || i.type=="RelationalNode") {
    //   expect(e.equals(i)).toBe(true);()
    // } else {
    //   expect(opExpected.equals(i)).toBe(true);
    // }


expect(opExpected.equals(i)).toBe(true);
  });
};
describe.each(simpleAddition)("%o => %o", tester);
