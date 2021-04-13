import { sort, flattenNode, s } from "../node-sort";
// @ts-ignore
import { parse, simplify, replacer } from "mathjs";
import diff from "jest-diff";
import { logger } from "../log";
const log = logger("mv:node-sort.spec");

type Fixture = [inputs: string | string[], expected: string];

const fixtures: Fixture[] = [
  ["1 + 1", "1 + 1"],
  [["2+1", "1+2"], "1+2"],
  [["2 + 1 * 3", "2 + 3 * 1"], "2 + 1 * 3"],
  ["(3 + 2) + 1", "1 + (2 + 3)"],
  ["(3 * 2) + 1", "1 + (2 * 3)"],
  [
    ["(4*((8+7)*6+5)+3)*2+1", "1 + 2 *(3 + 4*((8+7)*6+5))"],
    "1 + 2 * (3 + 4 * (5 + 6 * (7+8)))",
  ],
  ["2 + 3 * 1", "2 + 1 * 3"],
  ["3 * 1 + 2", "2 + 1 * 3"],
  ["(1 * 3) + 2", "2 + (1 * 3)"],
  // ["(2 + 3) * 1", "(2 + 3) * 1"],
  //["(3 + 2) * 1", "(2 + 3) * 1"],
  //["1 * (3 + 2) ", "(2 + 3) * 1"],
  ["a + b", "a + b"],
  ["b + a", "a + b"],
  ["a * b", "a * b"],
  ["b * a", "a * b"],
  ["b * a + 2", "2 + a * b"],
  [["a + b + c", "b+c+a"], "a + b + c"],
  // // /**
  // //  * needs to be flattened? result is [+, a, [+, b, c]]
  // //  * needs to be flattened expected is [+, [+ a, b], c]]
  // //  */
  //  ["a + e + b + c + f + g + d", "a + b + c +d+ e+ f+ g"],
  //  ["b * a * c", "a * b * c"],

  // // normalize comparatives too - always use greater than
  ["A < B", "B > A"],
  ["C + A < D + B", "B +D > A + C"],
  ["C + A + F < H + D + B", "B +D +H > A + C +F"],
  ["A > B", "A > B"],

  // // how to sort this?
  // ["A < B > C", "B > A > C"],
  // ["A > B + 2", "A > 2 + B"],
  // ["B + 2 < A ", "A > 2 + B"],
  // ["g+b > a > d ", "b+g > a > d"],
  // ["g+b > a > d ", "d < a < b+g"],
  // // // ["b <= a", "a >= b"],
  // ["a + (c + b)", "a + (b + c)"],
  // ["a*(c + b)", "(b + c)*a"],
  // ["(a+e) + (c + b)", "(e+a) + (b + c)"],

  // ["1+2*(3+4*(5+6*(7+8)))", "(4*((8+7)*6+5)+3)*2+1"],
];

// ${["+", "1", ["+", "2"]]} | ${["+", "1", "2"]}
// ${["+", "1", ["*", "2"]]} | ${["+", "1", ["*", "2"]]}
// ${["+", ["+", ["+", "1", "2"]], "3"]} | ${["+", "1", "2", "3"]}
// ${["+", ["+", ["*", "1", "2"]], "3"]} | ${["+", ["*", "1", "2"], "3"]}
// it.each`
//   input                | expected
//   ${["+", ["+", "1"]]} | ${["+", "1"]}
//    ${["+", "1", ["+", "2"]]} | ${["+", "1", "2"]}
// `("", ({ input, expected }) => {
//   const result = flattenNode(input);
//   console.log("result:", result);
//   expect(result).toEqual(expected);
// });

expect.extend({
  toEqualExpression(received, expected) {
    const options = {
      comment: "mathnode.equals equality",
      isNot: this.isNot,
      promise: this.promise,
    };

    // log(JSON.stringify(received, replacer, "  "));
    // log(JSON.stringify(expected, replacer, "  "));
    const pass = received.equals(expected);

    const message = pass
      ? () =>
          this.utils.matcherHint(
            "toEqualExpression",
            undefined,
            undefined,
            options
          ) +
          "\n\n" +
          `Expected: not ${this.utils.printExpected(expected.toString())}\n` +
          `Received: ${this.utils.printReceived(received.toString())}`
      : () => {
          const diffString = diff(expected.toString(), received.toString(), {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint(
              "toEqualExpression",
              undefined,
              undefined,
              options
            ) +
            "\n\n" +
            (diffString && diffString.includes("- Expect")
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected.toString())}\n` +
                `Received: ${this.utils.printReceived(received.toString())}`)
          );
        };

    return { actual: received, message, pass };
  },
});

describe.each(fixtures)("%s => %s", (input, expected) => {
  const e = parse(expected);

  const testInput = Array.isArray(input) ? input : [input];
  //@ts-ignore
  it.each(testInput as any)("%s", (ii) => {
    // console.log("i:", ii);

    let i = parse(ii);

    console.time("sort");
    const sorted = s(i);
    console.log("sorted", sorted);
    console.timeEnd("sort");
    // @ts-ignore
    expect(sorted).toEqualExpression(e);
  });
});
