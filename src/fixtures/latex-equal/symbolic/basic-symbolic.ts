import { Triage } from "../../triage";

export default {
  mode: "symbolic",
  //skip: true,
  tests: [
    {
      target: "100",
      eq: [
        "100",
        "50 + 50",
        "25 * 4",
        "200 / 2",
        "20 * 5",
        "2.5 * 40",
        "10 * 10",
        "100/2 + 50",
      ],
      ne: ["44 + 57", "100 - 0.001"],
    },
    {
      target: "x",
      eq: [
        "x",
        "x+0",
        "(x-2)+2",
        "((x^2 + x) / x) - 1",
        "2x/2",
        "((x^2 + x) / x) - 1",
      ],
      ne: ["y", "x + 1"],
    },
    {
      target: "(x + 2)^2",
      eq: [
        /** when simplified w/ perfect square formula - should be this */
        "x^2 + 4x + 4",
        "(2 + x)^2",
        "x^2 + 4(x+1)",
        //TRIAGE:two-rounds-of-normalization
        "x^2 + 8 ((x+1) / 2)",
      ],
      ne: ["x^2 + 4(x+2)"],
    },
    {
      label: "breaks - not sure why > $target",
      target: "(x + 2)^2",
      ne: ["x^3 + 4x + 4"],
    },

    {
      target: "y^(2 x)",
      eq: ["y^(x+x)"],
    },

    {
      target: "\\sqrt{4x}",
      eq: ["\\sqrt{3x + 1x}"],
    },
    {
      target: "1000",
      eq: ["1,000", "1,000.00"],
    },
    { target: "1,500,000", eq: "1500000" },
    { target: "sin(x)", eq: "sin(x)" },
    { target: "tan(x)", eq: "tan(x)" },
    // {
    //   target: "f^{-1}\\left(x\\right)=\\sqrt{x-1}+3",
    //   eq: "f^{-1}\\left(x\\right)=\\sqrt{x-1}+4-1",
    //   triage: Triage.INVERSE_FUNCTIONS,
    // },
    {
      target: "72\\div12=6\\text{eggs}",
      eq: ["72\\div12=(3+3)\\text{eggs}", "(3+3)\\text{eggs}=72\\div12"],
    },
    {
      target: "\\left(x\\right)^{ \\frac{1}{\\left(y + 3\\right)}}",
      eq: "\\sqrt[\\left(y + 3\\right)]{x}",
    },
    {
      target: "\\left(x\\right)^{\\frac{1}{3}}",
      eq: ["\\sqrt[3]{x}"],
    },
    {
      target: "\\left(x\\right)^{\\frac{1}{n}}",
      eq: "\\sqrt[n]{x}",
    },
    {
      target: "\\left(x\\right)^{\\frac{1}{n}}",
      eq: "\\sqrt[n]{x}",
    },
    {
      target: "\\left(x\\right)^{\\frac{1}{2}}",
      eq: "\\sqrt{x}",
    },
    {
      target: "\\left(x-1\\right)^{\\frac{1}{2}}+3",
      eq: "\\sqrt{x-1}+3",
    },
    // {
    //   target: "f^{-1}\\left(x\\right)=\\left(x-1\\right)^{\\frac{1}{2}}+3",
    //   eq: "f^{-1}\\left(x\\right)=\\sqrt{x-1}+3",
    //   triage: Triage.INVERSE_FUNCTIONS,
    // },
  ],
};
