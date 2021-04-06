export default {
  mode: "literal",
  skip: false,
  tests: [
    {
      target: "12 + 3 * x",
      eq: ["12    +     3   \\times x  "],
      ne: ["12.0 + 3 * x", "3 * x + 12"],
      opts: { literal: { allowTrailingZeros: false } },
    },
    {
      target: "12.00",
      eq: ["12.000000"],
      ne: ["12.001"],
      opts: { literal: { allowTrailingZeros: true } },
    },
    {
      only: true,
      target: "12.00",
      // eq: ["12.00"],
      ne: ["12.000000", "12.0", "12.000"],
      opts: { literal: { allowTrailingZeros: false } },
    },
    {
      target: "1",
      ne: ["1.000000"],
      opts: { literal: { allowTrailingZeros: false } },
    },
    {
      target: "2 + 3",
      eq: ["3 + 2"],
      opts: { literal: { ignoreOrder: true } },
    },
    {
      target: "2 + 3",
      ne: ["3 + 2"],
      opts: { literal: { ignoreOrder: false } },
    },
    {
      target: "a+b+c",
      eq: ["c+a+b"],
      opts: { literal: { ignoreOrder: true } },
    },
    {
      target: "a+b+c",
      ne: ["c+a+b"],
      opts: { literal: { ignoreOrder: false } },
    },
    {
      target: "12.00+3",
      eq: ["3+12.00"],
      opts: { literal: { allowTrailingZeros: true, ignoreOrder: true } },
    },
  ],
};
