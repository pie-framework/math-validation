export default {
  mode: "symbolic",
  //convert mixed numbers to an improper fraction
  tests: [
    {
      target: "4 \\frac{1}{2}",
      eq: [
        "4 \\frac{1}{2}",
        "4.5",
        "3.2 + 1.3",
        "(4 - \\frac{4}{5}) + 1.3",
        "\\frac{9}{2}",
        "\\frac{10}{2} - 0.5",
      ],
      ne: ["4.55"],
    },
    {
      target: "4* \\frac{1}{2}",
      eq: ["4* \\frac{1}{2}", "2", "\\frac{4}{2}"],
      ne: [
        "4 \\frac{1}{2}",
        "4.5",
        "3.2 + 1.3",
        "(4 - \\frac{4}{5}) + 1.3",
        "\\frac{9}{2}",
        "\\frac{10}{2} - 0.5",
      ],
    },
    {
      // only:true,
      target: "4\\frac{1}{2} + b + ca",
      eq: [
        "\\frac{10}{2} + ac + b- 0.5"
      ],
      // ne: ["\\frac{10}{2} + ac + b + 0.5"],
    },
  ],
};
