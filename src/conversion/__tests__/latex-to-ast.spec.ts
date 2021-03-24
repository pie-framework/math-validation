import { LatexToAst } from "../latex-to-ast";
// const k = require("katex");
// import { latexParser } from "latex-utensils";

const fixtures = [
  // we were getting [ [ '^', 'f', [ '-', 1 ] ], 'x' ]
  // ["f^{-1}\\left(x\\right)", ["*", ["^", ["f", "-1"]], "x"]],
  // ["1000", 1000],
  ["1,000", 1000],
  ["1,000,000", 1000000],
  // [
  // we were getting: [+, 6, [/, pi, x]]
  // "6\\frac{\\pi }{x}\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  //"6\\frac{\\pi }{x}", //\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  // "6 \\frac{\\pi}{x}", //\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  // ["+", 6, ["/", "pi", "x"]],
  // ],

  //   [
  //     `
  // \\frac{7x}{12}\\ \\text{dollars}
  //          x\\times \\frac{1}{12}\\times 7\\ \\text{dollars}
  //          x\\times 7\\times \\frac{1}{12}\\ \\text{dollars}`,
  //     [],
  //   ],
];

const lta = new LatexToAst();

describe("bugs in lta", () => {
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
    // console.log("kt:", kt);
    console.time("lta");
    const out = lta.convert(input);
    // console.log("out", out);
    // console.timeEnd("lta");
    expect(out).toEqual(expected);
  });
});
