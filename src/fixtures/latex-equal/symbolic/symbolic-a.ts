import { Triage } from "../../triage";

export default {
  mode: "symbolic",
  //skip: true,
  tests: [
    {
      // this is not a fraction conversion error, this is because we do not treat correctly expressions like (expression1, expression2)
      target: "\\left(\\frac{2\\sqrt{2}}{3},\\frac{1}{3}\\right)",
      eq: [
        "(\\frac{\\sqrt{8}}{3},\\frac{1}{3})",
        "(\\frac{2}{3}\\sqrt{2},\\frac{1}{3})",
        "(\\frac{1}{3}\\sqrt{8},\\frac{1}{3})",
        "(\\frac{1}{3}\\sqrt{8},\\frac{1}{3})",
      ],
    },
    {
      target:
        "f\\left[\\left(x,y\\right)\\right]=\\left(\\frac{x-3}{3},\\frac{y-2}{3}\\right)",
      eq: [
        // PASSING
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{1}{3}\\left(x-3\\right),\\frac{1}{3}\\left(y-2\\right))",
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{1}{3}\\left(-3+x\\right),\\frac{1}{3}\\left(-2+y\\right))",
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{-3+x}{3},\\frac{-2+y}{3})",

        // NON_EQUAL
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{x}{3}-1,\\frac{y-2}{3})",

        // PASSING
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{-3+x}{3},\\frac{-2+y}{3})",
      ],
    },
    {
      target: "-\\frac{3\\pi}{4}\\le x\\le\\frac{\\pi}{4}",
      eq: ["-\\frac{3}{4}\\pi\\ \\le\\ x\\le\\ \\ \\frac{1}{4}\\pi"],
    },
    {
      target: "2",
      eq: ["\\sqrt [3]{8}", "\\sqrt [3]8", "\\sqrt [3]8"],
    },
  ],
};
