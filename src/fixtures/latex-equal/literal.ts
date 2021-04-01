export default {
  mode: "literal",
  tests: [
    {
      target: "12 + 3 * x",
      eq: ["12    +     3   \\times x  "],
      ne: ["12.0 + 3 * x", "3 * x + 12"],
      opts: { allowTrailingZeros: false },
    },
    {
      target: "12.00",
      eq: ["12.000000"],
      ne: ["12.001"],
      opts: { allowTrailingZeros: true },
    },
    {
      only: true,
      target: "12.00",
      // eq: ["12.00"],
      ne: ["12.000000"],
      opts: { allowTrailingZeros: false },
    },
    { target: "2 + 3", eq: ["3 + 2"], opts: { ignoreOrder: true } },
    { target: "2 + 3", ne: ["3 + 2"], opts: { ignoreOrder: false } },
    { target: "a+b+c", eq: ["c+a+b"], opts: { ignoreOrder: true } },
    { target: "a+b+c", ne: ["c+a+b"], opts: { ignoreOrder: false } },
    {
      target: "12.00+3",
      eq: ["3+12.00"],
      opts: { allowTrailingZeros: true, ignoreOrder: true },
    },
  ],
};
