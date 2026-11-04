// large numbers must be compared by value, only undefined trigonometric values count as infinity
// before PIE-1418 any number of 1,497,258 or more (or -1,497,258 or less) was treated as infinity
export default {
  mode: "symbolic",
  tests: [
    {
      target: "2000000",
      eq: ["2\\times10^6", "2000000.0", "\\frac{4000000}{2}"],
      ne: ["3000000", "2000001", "1999999", "\\infty", "\\tan(90°)"],
    },
    {
      target: "-2000000",
      eq: ["-2\\times10^6", "-\\frac{4000000}{2}"],
      ne: ["-3000000", "2000000", "-\\infty"],
    },
    {
      // the old cutoff, values on both sides of it
      target: "1497259",
      ne: ["1497258", "1497260", "1600000", "\\infty"],
    },
    {
      target: "10^9",
      eq: ["1000000000", "10^{9}"],
      ne: ["10^{10}", "999999999"],
    },
    {
      label: "large value with a trigonometric function: $target",
      target: "2000000\\sin(90°)",
      eq: ["2000000"],
      ne: ["3000000", "\\infty"],
    },
    {
      target: "\\infty",
      eq: [
        "\\tan(90°)",
        "-\\tan(90°)",
        "2\\tan(90°)",
        "\\tan(-90°)",
        "\\tan(450°)",
        "\\tan(3\\pi/2)",
        "\\frac{1}{\\cos(90°)}",
        "\\frac{1}{\\sin(180°)}",
      ],
      ne: ["2000000", "-\\infty", "\\tan(89°)", "\\tan(45°)"],
    },
    {
      label: "undefined trigonometric value in a sum: $target",
      target: "3",
      eq: ["\\frac{1}{\\tan(90°)}+3", "3+\\cot(90°)"],
      ne: ["\\tan(90°)+3"],
    },
    {
      label: "angles that are only close to a multiple of 90° are not undefined: $target",
      target: "\\infty",
      eq: ["\\tan(810°)", "\\tan(4590°)", "\\tan(100\\grad)", "\\sqrt{\\tan(90°)}"],
      ne: [
        "\\tan(1.5708)",
        "\\tan(89.9999°)",
        "\\tan(89.9995°)",
        "\\tan(\\frac{\\pi}{2}+0.00001)",
        "\\csc(3.1416)",
      ],
    },
    {
      target: "\\sin(3.1416)\\cdot10^6",
      ne: ["0", "\\infty"],
    },
    {
      label: "angles far from a multiple of 90° are not matched, however large: $target",
      target: "\\infty",
      ne: ["\\tan(9090.001°)", "\\tan(90089.99°)", "\\tan(1572.367)"],
    },
    {
      target: "0",
      ne: ["\\tan(10000000)", "\\tan(3999999)"],
    },
    {
      label: "a replaced zero keeps exact fractions exact: $target",
      target: "\\frac{1}{3}",
      eq: ["\\sin(0)+\\frac{1}{3}", "\\frac{1+\\sin(0)}{3}"],
      ne: ["\\sin(0)+0.3333"],
    },
    {
      target: "-\\frac{1}{3}",
      eq: ["\\sin(0)-\\frac{1}{3}"],
    },
    {
      target: "\\frac{5}{6}",
      eq: ["\\tan(0°)+\\frac{5}{6}"],
    },
    {
      label: "letters next to a replaced zero are variables, not constants: $target",
      target: "\\phi",
      eq: ["\\sin(0)+\\phi"],
      ne: ["\\sin(0)+1.618"],
    },
    {
      target: "e",
      eq: ["\\sin(0)+e"],
    },
    {
      label: "indeterminate results are not equal to each other: $target",
      target: "\\tan(90°)-\\tan(90°)",
      ne: ["\\tan(90°)-\\tan(90°)+7", "0\\cdot\\tan(90°)"],
    },
    {
      target: "\\frac{\\tan(90°)}{\\tan(90°)}",
      ne: ["1", "\\frac{\\tan(90°)}{\\tan(90°)}+5"],
    },
    {
      label: "division by a zero of tan and cot: $target",
      target: "\\infty",
      eq: [
        "\\frac{1}{\\tan(180°)}",
        "\\frac{1}{\\tan(\\pi)}",
        "\\cot(180°)",
        "\\frac{1}{\\cot(90°)}",
      ],
    },
    {
      target: "0",
      eq: ["\\tan(180°)", "\\cot(90°)", "\\cos(90°)\\cdot10^7"],
      // indeterminate, not 0
      ne: ["\\tan(90°)-\\tan(90°)", "0\\cdot\\tan(90°)"],
    },
    {
      label: "division by zero has no sign: $target",
      target: "-\\frac{1}{\\cos(90°)}",
      eq: ["\\infty", "-\\sec(90°)", "\\frac{1}{\\cos(90°)}"],
      ne: ["-\\infty"],
    },
    {
      target: "\\frac{2}{\\sin(180°)}",
      eq: ["\\frac{-2}{\\sin(180°)}", "\\infty"],
    },
    {
      label: "undefined value next to a variable: $target",
      target: "x=\\infty",
      eq: ["x=\\tan(90°)"],
    },
    {
      target: "x+\\infty",
      eq: ["x+\\tan(90°)"],
    },
  ],
};
