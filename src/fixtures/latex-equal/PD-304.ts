export default {
  mode: "symbolic",
  tests: [
    {
      target: "1 * 3 * x",
      exception: ["1 * x * 3"],
      eq: ["x * 1 * 3", "x * 3", "3x"],
      ne: ["1 * x * 3"],
    },
  ],
};
