import { LatexToAst } from "../latex-to-ast";
// const k = require("katex");
// import { latexParser } from "latex-utensils";

const fixtures = [
  // TO DO -> parse inverse functions
  //we were getting [ [ '^', 'f', [ '-', 1 ] ], 'x' ]
  //["f^{-1}\\left(x\\right)", ["*", ["^", ["f", "-1"]], "x"]],

  //parentheses are stripped!
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
  // accept comparison operator ≤
  ["a≤b", ["le", "a", "b"]],
  // accept comparison operator ≥
  ["a≥b", ["ge", "a", "b"]],
  // parse text
  ["\\text{eggs}=8", ["=", "text{eggs}", 8]],
  [
    "4\\text{eggs}+5\\text{onions}",
    ["+", ["*", 4, "text{eggs}"], ["*", 5, "text{onions}"]],
  ],
  ["8=\\text{eggs}", ["=", 8, "text{eggs}"]],

  // convert sqrt when root=2
  ["\\sqrt {x}", ["apply", "sqrt", "x"]],
  ["\\sqrt [2]{x}", ["apply", "sqrt", "x"]],
  ["\\sqrt [2]x", ["apply", "sqrt", "x"]],
  ["\\sqrt x", ["apply", "sqrt", "x"]],

  // convert sqrt when root!=2
  ["\\sqrt [3]{x}", ["^", "x", ["/", 1, 3]]],

  // convert log

  ["\\log (x)", ["apply", "log", ["tuple", "x", 10]]],

  //something is wrong here
  ["\\log x", ["apply", "log", ["tuple", "x", 10]]],
  ["\\log_{10} (x)", ["apply", "log", ["tuple", "x", 10]]],
  ["\\ln x", ["apply", "log", "x"]],
  ["\\ln_{e}x", ["apply", "log", "x"]],

  // //  // TODO...
  // // ["a < b > c", ""],
  // // ["c < b > a", "1"],

  // [
  //   "a < b > c",
  //   ["relational", ["tuple", "a", "b", "c"], ["tuple", "smaller", "larger"]],
  // ],

  // [
  //   "6\\frac{\\pi }{x}\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
  //   [
  //     "*",
  //     ["+", 6, ["/", "pi", "x"]],
  //     "text{radians}",
  //     "text{per}",
  //     "text{second}",
  //   ],
  // ],

  // [
  //   `\\frac{7x}{12}\\ \\text{dollars}`,
  //   //  `x\\times \\frac{1}{12}\\times 7\\ \\text{dollars}
  //   //  x\\times 7\\times \\frac{1}{12}\\ \\text{dollars}`,
  //   [
  //     "*",
  //     ["/", ["*", 7, "x"], 12],
  //     "text{dollars}",
  //     // "x",
  //     // ["/", 1, 12],
  //     // 7,
  //     // "text{dollars}",
  //     // "x",
  //     // 7,
  //     // ["/", 1, 12],
  //     // "text{dollars}",
  // ],
  //],
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
