import { LatexToAst } from "../latex-to-ast";
// const k = require("katex");
// import { latexParser } from "latex-utensils";

const fixtures = [
  // we were getting [ [ '^', 'f', [ '-', 1 ] ], 'x' ]
  // ["f^{-1}\\left(x\\right)", ["*", ["^", ["f", "-1"]], "x"]],

  // parentheses are stripped!
  ["(1 + (1 + 1))", ["+", 1, 1, 1]],
  ["\\frac{1}{2}", ["/", 1, 2]],
  ["15%", ["%", 15]],
  ["(4 + 1) / (3 + 2 - 1)", ["/", ["+", 4, 1], ["+", 3, 2, ["-", 1]]]],
  ["1000", 1000],
  ["1,000", 1000],
  ["1,000,000", 1000000],
  ["1,000,000.000", ["tzn", 1000000, 3]],
  ["1,000,000.001", 1000000.001],
  ["1,000,000.00000000000000000", ["tzn", 1000000, 17]],
  ["1.00", ["tzn", 1, 2]],
  ["1.10", ["tzn", 1.1, 1]],
  ["1,001.10", ["tzn", 1001.1, 1]],
  ["1.11000", ["tzn", 1.11, 3]],
  // treat × as multiplication operator
  ["a×b", ["*", "a", "b"]],
  // treat • as multiplication operator
  ["a•b", ["*", "a", "b"]],
  // treat · as multiplication operator
  ["a·b", ["*", "a", "b"]],
  // treat ÷ as devide operator
  ["a÷b", ["/", "a", "b"]],
  // accept rational operator ≤
  ["a≤b", ["le", "a", "b"]],
  // accept rational operator ≥
  ["a≥b", ["ge", "a", "b"]],
  //  // TODO...
  // ["a < b > c", "1"],
  // ["c < b > a", "1"],
  //   [
  //   we were getting: [+, 6, [/, pi, x]]
  //   "6\\frac{\\pi }{x}\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  //   "6\\frac{\\pi }{x}", //\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  //   "6 \\frac{\\pi}{x}", //\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  //   ["+", 6, ["/", "pi", "x"]],
  //   ],

  //   [
  //     `
  // \\frac{7x}{12}\\ \\text{dollars}
  //          x\\times \\frac{1}{12}\\times 7\\ \\text{dollars}
  //          x\\times 7\\times \\frac{1}{12}\\ \\text{dollars}`,
  //     [],
  //   ],
];

const lta = new LatexToAst();

describe.only("bugs in lta", () => {
  // @ts-ignore
  it.each(fixtures)("%s => %s", (input, expected) => {
    // console.time("l-u");
    // const ast = latexParser.parse(input as string, { timeout: 5000 });
    // console.timeEnd("l-u");
    // let generator = new HtmlGenerator({ hyphenate: false });

    // console.time("latex.js");
    // let doc = parse(input, { generator: generator });
    // console.timeEnd("latex.js");

    // console.time("katexParse");
    // const kt = k.__parse(input);
    // console.timeEnd("katexParse");

    console.time("lta");
    const out = lta.convert(input);
    // console.log("out", out);
    // console.timeEnd("lta");
    expect(out).toEqual(expected);
  });
});
