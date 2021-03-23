export default {
  mode: "symbolic",
  label: "ed",
  tests: [
    {
      target: `\\frac{x}{12}\\times7\\text{dollars}`,
      eq: ["\\frac{7x}{12} \\text{dollars}", "\\frac{7x}{12}"],
      ne: ["1"]
    },
  ],
};
