import { Triage } from "../../triage";

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
      triage: Triage.NODE_SORT_SYMBOLIC,
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
      eq: "a÷b",
    },
    {
      target: "ab/x",
      eq: ["(b/x)•a", "(b/x)*a"],
    },
    {
      triage: Triage.NODE_SORT_SYMBOLIC,
      target: "a+b",
      eq: ["b+a"],
    },
    {
      target: "(a+b)/x",
      eq: "a/x + b/x",
    },
    eq("9,000", "9000"),

    {
      target: "8.5x",
      eq: ["8.5000x"],
    },
    {
      target: "-(a/b)",
      triage: [Triage.NODE_SORT_SYMBOLIC, Triage.IDENTITY_PROPERTY],
      eq: ["(-a)/b", "a/(-b)"],
    },
    {
      target: "ab(x+y)",
      eq: ["a(bx+by)", "(abx+aby)", "abx+aby", "abx + aby"],
      triage: Triage.DISTRIBUTIVE_PROPERTY,
    },
    { target: "88%", eq: "0.88" },
  ],
};
