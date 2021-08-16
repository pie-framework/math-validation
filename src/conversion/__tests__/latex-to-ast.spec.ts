import { LatexToAst } from "../latex-to-ast";
// const k = require("katex");
// import { latexParser } from "latex-utensils";

const fixtures = [
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

  // dollar sign
  ["1000$", ["*", 1000, "$"]],
  ["1000\\$", ["*", 1000, "$"]],
  ["\\$1000", ["*", "$", 1000]],

  // list of elements
  ["1,0,0,0", ["list", 1, 0, 0, 0]],
  ["a,b,c,d,e", ["list", "a", "b", "c", "d", "e"]],
  ["(x,y)", ["list", "x", "y"]],
  ["(1,000,-20)", ["list", 1000, ["-", 20]]],

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
  ["\\log x", ["apply", "log", ["tuple", "x", 10]]],
  ["\\log_{10} (x)", ["apply", "log", ["tuple", "x", 10]]],
  ["\\ln x", ["apply", "log", "x"]],
  ["\\ln_{e}x", ["apply", "log", "x"]],

  // relational expression
  [
    "a < b > c",
    ["relational", ["tuple", "a", "b", "c"], ["tuple", "smaller", "larger"]],
  ],

  [
    "c < b > a",
    ["relational", ["tuple", "c", "b", "a"], ["tuple", "smaller", "larger"]],
  ],

  [
    "6\\frac{\\pi }{x}\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
    [
      "*",
      ["+", 6, ["/", "pi", "x"]],
      "text{radians}",
      "text{per}",
      "text{second}",
    ],
  ],

  // fractions
  [
    `\\frac{7x}{12}\\ \\text{dollars}`,
    ["*", ["/", ["*", 7, "x"], 12], "text{dollars}"],
  ],

  [
    `x\\times \\frac{1}{12}\\times 7\\ \\text{dollars}`,
    ["*", "x", ["/", 1, 12], 7, "text{dollars}"],
  ],

  [
    `x\\times 7\\times \\frac{1}{12}\\ \\text{dollars}`,
    ["*", "x", 7, ["/", 1, 12], "text{dollars}"],
  ],

  // inverse functions
  ["f^{-1}(x)", ["*", "f^{-1}", "x"]],
  ["f^{-1}(x) = x+5", ["=", ["*", "f^{-1}", "x"], ["+", "x", 5]]],
  ["g^{-1}(y)", ["*", "g^{-1}", "y"]],
  ["g^{-1}(y) = y-5", ["=", ["*", "g^{-1}", "y"], ["+", "y", ["-", 5]]]],

  // inverse trigonometric functions
  ["\\sin^{-1}(x)", ["apply", "asin", "x"]],
  ["\\arcsin(x)", ["apply", "asin", "x"]],
  ["\\arsin(x)", ["apply", "asin", "x"]],

  ["\\cos^{-1}(x)", ["apply", "acos", "x"]],
  ["\\arcos(x)", ["apply", "acos", "x"]],
  ["\\arccos(x)", ["apply", "acos", "x"]],

  ["\\tan^{-1}(x)", ["apply", "atan", "x"]],
  ["\\artan(x)", ["apply", "atan", "x"]],
  ["\\arctan(x)", ["apply", "atan", "x"]],

  ["\\cot^{-1}(x)", ["apply", "acot", "x"]],
  ["\\arcot(x)", ["apply", "acot", "x"]],
  ["\\arccot(x)", ["apply", "acot", "x"]],

  ["\\sec^{-1}(x)", ["apply", "asec", "x"]],
  ["\\arsec(x)", ["apply", "asec", "x"]],
  ["\\arcsec(x)", ["apply", "asec", "x"]],

  ["\\csc^{-1}(x)", ["apply", "acsc", "x"]],
  ["\\arcsc(x)", ["apply", "acsc", "x"]],
  ["\\arccsc(x)", ["apply", "acsc", "x"]],
];

const lta = new LatexToAst();

describe("bugs in lta", () => {
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
