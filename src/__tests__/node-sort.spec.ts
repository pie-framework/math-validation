import { flattenNode, s } from "../node-sort";
// @ts-ignore
import { mathjs, replacer } from "../mathjs";
const { parse } = mathjs;
import diff from "jest-diff";
import { logger } from "../log";
const log = logger("mv:node-sort.spec");
import { AstToMathJs } from "../conversion/ast-to-mathjs";

type Fixture = [
  /**
   * a math strng or array of math string
   */
  inputs: string | string[],

  /**
   * either a math string or a simple ast array
   */
  expected: string | any[]
];

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
  [["(3 + 2) * 1", "(2 + 3) * 1", "1 * (3 + 2) "], "1 * (2 + 3)"],
  ["a + b", "a + b"],
  ["b + a", "a + b"],
  ["a * b", "a * b"],
  ["b * a", "a * b"],
  ["b * a + 2", "2 + a * b"],
  [["a + (c + b)", "(b + c)+ a"], "a + (b + c)"],
  ["a * (c + b)", "a * (b +c )"],
  [["(e + a) + (c + b)", "(c + b) + (e + a)"], "(a + e) + (b + c)"],
  [["(4 + 1) + (3 + 2)", "(3 + 2) + (4 + 1)"], "(1+4) + (2 + 3)"],
  [
    ["a + b + c", "b+c+a"],
    ["+", "a", "b", "c"],
  ],
  ["a + e + b + c + f + g + d", ["+", "a", "b", "c", "d", "e", "f", "g"]],
  ["b * a * c", ["*", "a", "b", "c"]],
  // [["(1 + (1 + 1))"], ["()", ["+", 1, ["()", ["+", 1, 1]]]]],
  // [["(4 + 1) + (2 * x)"], ["+", ["()", ["+", 1, 4]], ["()", ["*", 2, "x"]]]],
  // [
  //   ["(4 + 1 + z) + (3 + 2 * x)", "(2 * x + 3) + (z + 4 + 1)"],
  //   ["+", ["+", "1", "4", "z"], ["+", "3", ["*", "2", "x"]]],
  // ],
  // ["C + A + F < H + D + B", "B + D + H > A + C + F"],
  // ["C + A + F <= H + D + B", "B  + D + H >= A + C + F"],
  // // normalize comparatives too - always use greater than
  ["A < B", "B > A"],
  ["C + A < D + B", "B +D > A + C"],
  [["A > B", "B < A"], "A > B"],
  [["A > B + 2", "B + 2 < A "], "A > 2 + B"],
  // // // how to sort this?
  // // ["A < B > C", "C < B > A"],
  // // always use greater than
  [["g + b < a < d ", "d > a > g + b"], "d > a > b + g"],
  [["b <= a", "a >= b"], "a >= b"],
  [["b < a <= d", "d >= a > b"], "d >= a > b"],
  [["b <= a <= d", "d >= a >= b"], "d >= a >= b"],
];

// ["parenthesis", ["+"]];
const atm = new AstToMathJs();

it.each`
  input                                 | expected
  ${["+", ["+", "1"]]}                  | ${["+", "1"]}
  ${["+", "1", ["+", "2"]]}             | ${["+", "1", "2"]}
  ${["+", "1", ["*", "2"]]}             | ${["+", "1", ["*", "2"]]}
  ${["+", ["+", ["+", "1", "2"]], "3"]} | ${["+", "1", "2", "3"]}
  ${["+", ["+", ["+", "a", "b"]], "c"]} | ${["+", "a", "b", "c"]}
  ${["+", ["+", ["*", "1", "2"]], "3"]} | ${["+", ["*", "1", "2"], "3"]}
`("", ({ input, expected }) => {
  input = atm.convert(input);
  const result = flattenNode(input);
  const ex = atm.convert(expected);
  expect(result).toEqual(ex);
});

expect.extend({
  toEqualExpression(received, expected: string | string[]) {
    const options = {
      comment: "mathnode.equals equality",
      isNot: this.isNot,
      promise: this.promise,
    };

    const expectedNode =
      typeof expected === "string" ? parse(expected) : atm.convert(expected);

    // console.log("expected node:", expectedNode);
    // console.log("received:", received);
    log("received", JSON.stringify(received, replacer, "  "));
    log("expected", JSON.stringify(expectedNode, replacer, "  "));
    const pass = received.equals(expectedNode);

    const message = pass
      ? () =>
          this.utils.matcherHint(
            "toEqualExpression",
            undefined,
            undefined,
            options
          ) +
          "\n\n" +
          `Expected: not ${this.utils.printExpected(
            expectedNode.toString()
          )}\n` +
          `Received: ${this.utils.printReceived(received.toString())}`
      : () => {
          const diffString = diff(
            expectedNode.toString(),
            received.toString(),
            {
              expand: this.expand,
            }
          );
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
              : `Expected: ${this.utils.printExpected(
                  expectedNode.toString()
                )}\n` +
                `Received: ${this.utils.printReceived(received.toString())}`)
          );
        };

    return { actual: received, message, pass };
  },
});

describe.only.each(fixtures)("%s => %s", (input, expected) => {
  // const e = parse(expected);

  const testInput = Array.isArray(input) ? input : [input];
  //@ts-ignore
  it.each(testInput as any)("%s", (ii) => {
    let i = parse(ii);

    // console.time("sort");
    const sorted = s(i);
    // console.timeEnd("sort");
    // @ts-ignore
    expect(sorted).toEqualExpression(expected);
  });
});
