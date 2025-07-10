export default {
  mode: "symbolic",
  tests: [
    {
      // simple expression with unit
      target: "3.5 \\text{gal}",
      eq: ["3.5 \\text{gal}", "\\frac{7}{2} \\text{gal}"],
      ne: [
        "3.5",
        "3.5 \\text{L}", // liters ≠ gallons
      ],
    },
    {
      // multiplication with units
      target: "2 * 3.5 \\text{gal}",
      eq: ["7 \\text{gal}", "2 * \\frac{7}{2} \\text{gal}"],
      ne: ["7", "7 \\text{L}"],
    },
    {
      // addition with same unit
      target: "1 \\text{gal} + 2 \\text{gal}",
      eq: ["3 \\text{gal}", "\\text{gal} + 2 \\text{gal}"],
      ne: ["3", "1 + 2 \\text{gal}", "1 \\text{L} + 2 \\text{gal}"],
    },
    {
      // TODO test unit in equation
      // target: "x = 4 gal",
      // eq: ["4 gal = x"],
      // ne: ["x = 4", "x = 4 L"],
    },
    {
      target: "4 gal",
      eq: ["4 gal"],
      ne: ["4", "4 L"],
    },
    {
      // units in division
      target: "\\frac{7 \\text{gal}}{2}",
      eq: ["3.5 \\text{gal}"],
      ne: ["3.5", "\\frac{7}{2}"],
    },
  ],
};
