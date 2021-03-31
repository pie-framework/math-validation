import { Triage } from "../triage";

export default {
  mode: "symbolic",
  skip: false,
  tests: [
    {
      target: "\\left(\\frac{2\\sqrt{2}}{3},\\frac{1}{3}\\right)",
      eq: [
        "(\\frac{\\sqrt{8}}{3},\\frac{1}{3})",
        "(\\frac{2}{3}\\sqrt{2},\\frac{1}{3})",
        "(\\frac{1}{3}\\sqrt{8},\\frac{1}{3})",
        "(\\frac{1}{3}\\sqrt{8},\\frac{1}{3})",
      ],
      triage: Triage.FRACTION_CONVERSION_ERROR,
    },
    {
      target:
        "f\\left[\\left(x,y\\right)\\right]=\\left(\\frac{x-3}{3},\\frac{y-2}{3}\\right)",
      eq: [
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{1}{3}\\left(x-3\\right),\\frac{1}{3}\\left(y-2\\right))",
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{1}{3}\\left(-3+x\\right),\\frac{1}{3}\\left(-2+y\\right))",
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{-3+x}{3},\\frac{-2+y}{3})",
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{x}{3}-1,\\frac{y-2}{3})",
        "f\\left[\\left(x,y\\right)\\right]=(\\frac{-3+x}{3},\\frac{-2+y}{3})",
      ],
      triage: Triage.COMMON_DENOMINATOR
    },
    {
      target: "-\\frac{3\\pi}{4}\\le x\\le\\frac{\\pi}{4}",
      eq: ["-\\frac{3}{4}\\pi\\ \\le\\ x\\le\\ \\ \\frac{1}{4}\\pi"],
    },
  ],
};
