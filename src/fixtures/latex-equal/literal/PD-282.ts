export default {
  mode: "literal",
  tests: [
    {
      opts: {
        literal: { allowTrailingZeros: true },
      },
      target: "1",
      eq: ["1.0", "01"],
      ne: ["1.01"],
    },
    {
      opts: {
        literal: { allowTrailingZeros: false },
      },
      target: "1",
      eq: ["1"],
      ne: ["1.0"],
    },
  ],
};
