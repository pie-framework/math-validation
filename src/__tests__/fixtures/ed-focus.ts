export default {
  mode: "symbolic",
  label: "ed",
  tests: [
    {
      label: "foo",
      target: `\\frac{x}{12}\\times7\\text{dollars}`,
      eq: ["\\frac{7x}{12} \\text{dollars}"],
    },
  ],
};
