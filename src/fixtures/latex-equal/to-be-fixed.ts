import { Triage } from "../triage";

export default {
  mode: "symbolic",
  skip: true,
  tests: [
    {
      // error: underscore not implemented for conversion
      target: "a_n=3a_{n-1}",
      eq: ["a_n=3\\times a_{n-1}"],
      triage: Triage.UNDERSCORE_SUPPORT,
    },
    {
      // all passed
      target: "f\\left(y\\right)=26000\\left(0.83\\right)^y",
      eq: [
        "f\\left(y\\right)=26000\\left(1-0.17\\right)^y",
        "f\\left(y\\right)=26,000\\left(1-0.17\\right)^y",
        "f\\left(y\\right)=26,000\\left(0.83\\right)^y",
      ],
    },
    {
      // error     Non string functions not implemented for conversion to mathjs
      target: "f^{-1}\\left(x\\right)=-\\frac{12}{x}+8",
      eq: [
        "f^{-1}(x)\\ =\\ 8-\\frac{12}{x}",
        "f^{-1}(x)\\ =\\ \\frac{8x-12}{x}",
        "f^{-1}(x)\\ =\\ \\frac{-12+8x}{x}",
        "f^{-1}(x)\\ =\\ -12\\left(\\frac{1}{x}\\right)+8",
        "f^{-1}(x)\\ =\\ 8-12\\left(\\frac{1}{x}\\right)",
      ],
      triage: Triage.NON_STRING,
    },
    {
      // all passed
      target: "f\\left(x\\right)=1.1x+8",
      eq: [
        "f(x)\\ =\\ 8+1.1x",
        "f(x)\\ =\\ 8+\\left(1+0.1\\right)x",
        "f(x)\\ =\\ \\left(1+0.1\\right)x+8",
        "f(x)\\ =\\ x+0.1x+8",
        "f(x)\\ =\\ 8+x+0.1x",
        "f(x)\\ =\\ 8+x+0.1x",
        "f(x)\\ =\\ 8+0.1x+x",
        "f(x)\\ =\\ 0.1x+x+8",
      ],
    },
    {
      // all passed
      target: "x=\\frac{20,000}{r^2}\\text{radians}",
      eq: [
        "x=\\frac{1}{r^2}\\left(20,000\\right)\\ \\text{radians}",
        "x=\\frac{20000}{r^2}\\ \\text{radians}",
        "x=\\frac{1}{r^2}\\times 20000\\ \\text{radians}",
        "x=\\frac{1}{r^2}\\times 20,000\\ \\text{radians}",
        "x=20000\\left(\\frac{1}{r^2}\\right)\\ \\text{radians}",
        "x=20,000\\left(\\frac{1}{r^2}\\right)\\ \\text{radians}",
      ],
    },
    {
      // invalid location of =
      target: "\\text{height}\\ =\\ 120\\sin\\theta",
      eq: [
        "\\text{height}\\ =\\ 120\\left(\\sin \\theta \\right)",
        "\\text{height}\\ =\\ 120\\sin \\left(\\theta \\right)",
        "\\text{height}\\ =\\ \\left(\\sin \\theta \\right)\\left(120\\right)",
        "\\text{height}\\ =\\ \\left(\\sin \\theta \\right)\\times 120",
        "\\text{height}\\ =\\ \\sin \\theta \\times 120",
      ],
      triage: Triage.EQUAL_LOCATION_PARSE_ERROR,
    },
    {
      // expecting ( after function
      target: "\\cos\\theta=-\\sqrt{1-y^2}",
      eq: ["cos\\ \\theta\\ \\ =\\ -\\sqrt{-y^2+1}"],
      triage: Triage.EXPECTING_PARANTHESIS,
    },
    {
      // precision error
      target: "100",
      ne: ["100 - 0.0001"],
    },
  ],
};
