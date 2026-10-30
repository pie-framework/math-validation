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
  ],
};
