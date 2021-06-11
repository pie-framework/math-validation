export default {
  mode: "symbolic",
  tests: [
    {
      target: "1 * 3 * x",
      opts: {
        exception: ["1 * x * 3"],
      },
      eq: ["x * 1 * 3", "x * 3", "3x"],
      ne: ["1 * x * 3"],
    },
  ],
};
