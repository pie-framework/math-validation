import { flattenNode, s } from "../node-sort";
// @ts-ignore
import { replacer, parse } from "../mathjs";
import diff from "jest-diff";
import { logger } from "../log";
const log = logger("mv:node-sort.spec");
import { AstToMathJs } from "../conversion/ast-to-mathjs";
import { LatexToAst } from "../conversion/latex-to-ast";

type Fixture = [
  /**
   * a math string or array of math string
   */
  inputs: string | string[],

  /**
   * either a math string or a simple ast array
   */
  expected: string | any[]
];

const fixtures: Fixture[] = [
  [["y*(3)", "(y)*3", "(y)*(3)", "(3)*(y)"], "3*y"],
  [["3(y)", "(3)(y)", "(y)(3)", "((((y))))(3)"], "3y"],
  ["3y", "3y"],
  ["(y+x)*(3)", "3*(x+y)"],
  ["1 + 1", "1 + 1"],
  ["1 + 1", ["+", 1, 1]],
  [["2+1", "1+2"], "1+2"],
  [["2 + 1 * 3", "2 + 3 * 1"], "2 + 1 * 3"],
  ["(3 * 2) + 1", "1 + 2 * 3"],
  [
    ["(4*((8+7)*6+5)+3)*2+1", "1 + 2 *(3 + 4*((8+7)*6+5))"],
    "1 + 2 * (3 + 4 * (5 + 6 * (7+8)))",
  ],
  ["2 + 3 * 1", "2 + 1 * 3"],
  ["3 * 1 + 2", "2 + 1 * 3"],
  ["(1 * 3) + 2", "2 + 1 * 3"],
  [["(3 + 2) * 1", "(2 + 3) * 1", "1 * (3 + 2) "], "1 * (2 + 3)"],
  ["a + b", "a + b"],
  ["b + a", "a + b"],
  ["a * b", "a * b"],
  ["b * a", "a * b"],
  ["b * a + 2", "2 + a * b"],
  [
    ["a + (c + b)", "(b + c)+ a"],
    ["+", "a", "b", "c"],
  ],
  ["a * (c + b)", "a * (b +c)"],
  ["a + (c + b)", ["+", "a", "b", "c"]],
  [
    ["(e + a) + (c + b)", "(c + b) + (e + a)"],
    ["+", "a", "b", "c", "e"],
  ],
  [
    ["a + b + c", "b+c+a"],
    ["+", "a", "b", "c"],
  ],
  ["a + e + b + c + f + g + d", ["+", "a", "b", "c", "d", "e", "f", "g"]],
  ["b * a * c", ["*", "a", "b", "c"]],
  ["C + A + F < H + D + B", [">", ["+", "B", "D", "H"], ["+", "A", "C", "F"]]],
  [
    "C + A + F <= H + D + B",
    ["ge", ["+", "B", "D", "H"], ["+", "A", "C", "F"]],
  ],
  [
    ["(4 + 1) + (3 + 2)", "(3 + 2) + (4 + 1)"],
    ["+", 1, 2, 3, 4],
  ],
  ["(4 + 1) + (3 * 2)", ["+", 1, 4, ["*", 2, 3]]],
  ["(3 + 2) + (4 * 1)", ["+", 2, 3, ["*", 1, 4]]],

  // normalize comparatives too - always use greater than
  ["A < B", "B > A"],
  ["C + A < D + B", "B +D > A + C"],
  [["A > B", "B < A"], "A > B"],
  [["A > B + 2", "B + 2 < A "], "A > 2 + B"],
  // this fails from PD283 also because our ast to mathjs parses this case < > in an operationl node, not a relational node like mathjs
  [["A < B > C", "C < B > A"], "A < B > C"],
  [["C == B == A", "A == B == C", "B == C == A", "B == A == C"], "A == B == C"],
  ["C + B + A == B + A + C", ["=", ["+", "A", "B", "C"], ["+", "A", "B", "C"]]],
  [
    "C + B + A == B + A + C == A + C +B",
    ["=", ["+", "A", "B", "C"], ["+", "A", "B", "C"], ["+", "A", "B", "C"]],
  ],
  /// always use greater than
  [["g + b < a < d ", "d > a > g + b"], "d > a > b + g"],
  [["b <= a", "a >= b"], "a >= b"],
  [["b < a <= d", "d >= a > b"], "d >= a > b"],
  [["b < a < d", "d > a > b"], "d > a > b"],

  // allow the sides of an equation to be swapped
  [["x == y", "y == x"], "x ==y"],
  [["7+x == y", "y == 7 + x"], " y == 7 + x"],

  //fails - the way we parse the ast-to-math constant node is diffrent from the way mathjs parses a node
  ["(3 + 2) + 1", ["+", 1, 2, 3]],
  ["(y*x)(3)", ["*", 3, "x", "y"]],

  //strip parenthesis
  //[["(1 + (1 + 1))"], ["()", ["+", 1, ["()", ["+", 1, 1]]]]],
  // [["(4 + 1) + (2 * x)"], ["+", ["()", ["+", 1, 4]], ["()", ["*", 2, "x"]]]],
  [
    ["(4 + 1 + z) + (3 + 2 * x)", "(2 * x + 3) + (z + 4 + 1)"],
    ["+", 1, 3, 4, "z", ["*", 2, "x"]],
  ],
  // // fails, our ast to mathjs parses this case < > in an operationl node, not a relational node like mathjs
  // [
  //   "y + w + z > c < a + e + d + f",
  //   ["<", [">", ["+", "w", "y", "z"], "c"], ["+", "a", "d", "e", "f"]],
  // ],
];
const ff = [];

// ["parenthesis", ["+"]];

const lta = new LatexToAst();
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

    delete expectedNode.comment;

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

describe.each(fixtures)("%s => %s", (input, expected) => {
  const testInput = Array.isArray(input) ? input : [input];
  //@ts-ignore
  it.each(testInput as any)("%s", (ii) => {
    let i = parse(ii);

    const sorted = s(i);

    // @ts-ignore
    expect(sorted).toEqualExpression(expected);
  });
});
