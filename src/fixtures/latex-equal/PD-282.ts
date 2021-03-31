export default {
  mode: "literal",
  skip: true,
  tests: [
    {
      opts: {
        allowTrailingZeros: true,
      },
      target: "1",
      eq: ["1.0"],
      ne: ["1.01"],
    },
    {
      opts: {
        allowTrailingZeros: false,
      },
      target: "1",
      eq: ["01"],
      ne: ["1.0"],
    },
  ],
};
