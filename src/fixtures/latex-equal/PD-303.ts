import { Triage } from "../triage";

export default {
  mode: "literal",
  skip: false,
  tests: [
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "a+b+c ",
      eq: ["(a+b) + c", "a + (b+c)"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "sin x",
      eq: ["sin(x)"],
      ne: ["1.0"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x^\\frac{1}{2}",
      eq: ["x^(\\frac{1}{2})"],
    },
    {
      only: true,
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "\\sqrt {x}",
      eq: ["\\sqrt [2]{x}"],
      ne: ["\\sqrt [3]{x}", "\\sqrt [3]{x}"],
      triage: [Triage.EQUIVALENT_FUNCTIONS],
    },
    {
      //only: true,
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "\\log (x)",
      eq: ["\\log_{10}(x)"],
      triage: [Triage.EQUIVALENT_FUNCTIONS],
    },
    {
      //only: true,
      opts: {
        literal: { ignoreOrder: true },
      },

      target: "\\ln(x)",
      eq: ["\\log{e}(x)"],
      triage: [Triage.EQUIVALENT_FUNCTIONS],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "2xy+3x+4y+5",
      eq: [
        "\\left(2xy+3x\\right)+4y+5",
        "\\left(2xy+3x\\right)+\\left(4y+5\\right)",
        "2xy+3x+\\left(4y+5\\right)",
        "2xy+\\left(3x+4y\\right)+5",
        "\\left(2xy+3x+4y+5\\right)",
        "2x\\left(y\\right)+3x+4y+5",
        "2\\left(x\\right)y+3x+4y+5",
      ],
      ne: ["x\\left(3\\right)+4y+2yx+5", "3x+4y+2yx+5", "2yx+3x+4y+5"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "3y",
      eq: [
        "y\\left(3\\right)",
        "y\\left(\\left(\\left(3\\right)\\right)\\right)",
      ],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "2xy+3x+4y+5",
      eq: [
        "2yx+3x+4y+5",
        "\\left(5+3x+4y+2xy\\right)",
        "\\left(5+3x\\right)+\\left(4y+2xy\\right)",
        "\\left(2xy+3x\\right)+4y+5",
        "\\left(2xy+3x\\right)+\\left(4y+5\\right)",
        "\\left(3x+2xy\\right)+\\left(4y\\right)+5",
        "2xy+3x+\\left(4y+5\\right)",
        "2xy+\\left(3x+4y\\right)+5",
        "\\left(2xy+3x+4y+5\\right)",
        "2x\\left(y\\right)+3x+4y+5",
        "2\\left(x\\right)y+3x+4y+5",
        "2\\left(y\\right)\\left(x\\right)+3x+4y+5",
        "2xy+3\\left(x\\right)+4y+5",
        "2xy+3\\left(x\\right)+4y + 5",
        "3\\left(x\\right)+4y+2yx+5",
      ],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "3\\left(x+y\\right)",
      eq: [
        "\\left(3\\right)\\left(x+y\\right)",
        "\\left(3\\left(x+y\\right)\\right)",
        "3\\times \\left(x+y\\right)",
      ],
      ne: ["\\left(3\\right)x+y"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "sin t",
      eq: ["sin \\left(t\\right)"],
      ne: ["x\\left(3\\right)+4y+2yx+5", "3x+4y+2yx+5", "2yx+3x+4y+5"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "cos x+35",
      eq: [
        "cos \\left(x\\right)+35",
        "\\left(cos \\left(x\\right)\\right)+\\left(35\\right)",
      ],
      ne: ["cos \\left(x+35\\right)"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "tan \\left(x\\right)+35",
      eq: ["tan x+35", "\\left(tan x\\right)+35", "\\left(tan x+35\\right)"],
      ne: ["tan \\left(x+35\\right)"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "n^{\\frac{3}{5}}",
      eq: ["n^{\\left(\\frac{3}{5}\\right)}"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "n^{\\left(\\frac{3}{5}\\right)}",
      eq: ["n^{\\frac{3}{5}}"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "5^{ab}",
      eq: [
        "5^{\\left(ab\\right)}",
        "5^{ba}",
        "\\left(5^{ba}\\right)",
        "5^{\\left(ba\\right)}",
      ],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "ab+cd=0",
      eq: [
        "0=ab+cd",
        "0=\\left(ab\\right)+\\left(cd\\right)",
        "0=\\left(cd\\right)+\\left(ab\\right)",
        "0=\\left(dc\\right)+\\left(ab\\right)",
        "0=\\left(dc\\right)+\\left(ba\\right)",
      ],
      ne: [
        "0=a+cd",
        "0=\\left(ab\\right)+\\left(d\\right)",
        "0=\\left(cd\\right)+\\left(b\\right)",
        "0=\\left(d\\right)+\\left(ab\\right)",
        "0=\\left(dc\\right)+\\left(a\\right)",
      ],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "ab+cd=0",
      ne: [
        "0=ab+cd",
        "0=\\left(ab\\right)+\\left(cd\\right)",
        "0=\\left(cd\\right)+\\left(ab\\right)",
        "0=\\left(dc\\right)+\\left(ab\\right)",
        "0=\\left(dc\\right)+\\left(ba\\right)",
      ],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "y=2\\left(x-3\\right)^2+4",
      eq: [
        "2\\left(x-3\\right)^2+4=y",
        "4+2\\left(x-3\\right)^2=y",
        "4+2\\left(-3+x\\right)^2=y",
        "4+\\left(2\\left(-3+x\\right)^2\\right)=y",
        "\\left(4\\right)+\\left(2\\left(-3+x\\right)^2\\right)=y",
      ],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "3\\left(x\\right)+\\left(2\\right)\\left(y\\right)<0",
      eq: [
        "\\left(3\\right)x+\\left(2\\right)\\left(y\\right)<0",
        "\\left(3\\right)x+\\left(2\\right)\\left(y\\right)<0",
        "0>\\left(3\\right)x+\\left(2\\right)\\left(y\\right)",
        "0>\\left(3\\right)x+\\left(y\\right)2",
        "3x+\\left(2\\right)\\left(y\\right)<0",
      ],
      ne: ["cos \\left(x+35\\right)"],
    },
  ],
};
