import { Triage } from "../triage";

const eq = (a, eq) => ({ target: a, eq });

export default {
  mode: "symbolic",
  skip: true,
  tests: [
    {
      target: "a/x",
      eq: "(1/x) * a",
    },
    {
      target: "a(x+y)",
      eq: "ax+ay",
    },
    {
      target: "ab",
      triage: Triage.NODE_SORT,
      eq: [
        "a*b",
        "a(b)",
        "(a)b",
        "(a)(b)",
        "ba",
        "b \\times a",
        "b*a",
        "(b)a",
        "b(a)",
        "(b)(a)",
      ],
    },
    {
      target: "a/b",
      triage: Triage.LATEX_PARSE_ERROR,
      eq: "a÷b",
    },
    {
      target: "ab/x",
      triage: Triage.LATEX_PARSE_ERROR,
      eq: ["(b/x)•a", "(b/x)*a"],
    },
    {
      triage: Triage.NODE_SORT,
      target: "a+b",
      eq: ["b+a"],
    },
    {
      target: "(a+b)/x",
      eq: "a/x + b/x",
    },
    eq("9,000", "9000"),
    eq("8.5x", "8.5000x"),
    {
      target: "-(a/b)",
      triage: [Triage.NODE_SORT, Triage.IDENTITY_PROPERTY],
      eq: ["(-a)/b", "a/(-b)"],
    },
    { target: "ab(x+y)", eq: ["a(bx+by)", "(abx+aby)", "abx+aby", "abx + aby"], triage:Triage.DISTRIBUTIVE_PROPERTY },
    { target: "88%", eq: "0.88", triage: Triage.PERCENT_SUPPORT },
  ],
};
