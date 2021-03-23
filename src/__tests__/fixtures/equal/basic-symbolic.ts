export default {
  mode: "symbolic",

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
      ne: ["44 + 57", "100 - 0.0001"],
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
      target: "x^2",
      eq: ["((x^3 + x)/x) -1"],
    },
    {
      target: "x",
      eq: ["x", "x+0", "(x-2)+2", "2x/2", "((x^2 + x) / x) - 1"],
      ne: ["y", "x + 1"],
    },
    {
      only: true,
      target: "(x + 2)^2",
      eq: ["x^2 + 4x + 4"], //, "x^2 + 4(x+1)", "x^2 + 8 ((x+1) / 2)"],
      // ne: ["x^3 + 4x + 4", "x^2 + 4(x+2)"],
    },
    {
      target: "y^(2 x)",
      eq: ["y^(x+x)"],
    },
    {
      target: "\\sqrt{4x}",
      eq: ["\\sqrt{3x + 1x}"],
    },
    // {
    //   target: "1000",
    //   eq: ["1,000", "1,000.00"],
    // },
    // // { target: "1,500,000", eq: '1500000'  },
    // { target: "sin(x)", eq: "sin(x)" },
    // { target: "tan(x)", eq: "tan(x)" },
    // {
    {
      target: "72\\div12=6\\text{eggs}",
      eq: "72\\div12=(3+3)\\text{eggs}",
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
    //Note: bad ast for this: [ [ '^', 'f', [ '-', 1 ] ], 'x' ]
    //   target: "f^{-1}\\left(x\\right)=\\sqrt{x-1}+3",
    //   eq: "f^{-1}\\left(x\\right)=\\sqrt{x-1}+4-1",
    // },
    // {
    //   target: "f^{-1}\\left(x\\right)=\\left(x-1\\right)^{\\frac{1}{2}}+3",
    //   eq: "f^{-1}\\left(x\\right)=\\sqrt{x-1}+3",
    // },
  ],
};