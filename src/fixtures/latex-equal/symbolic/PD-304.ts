export default {
  mode: "symbolic",
  tests: [
    {
      target: "1 * 3 * x *y",
      opts: {
        exception: ["1 * x * 3 *y"],
      },
      eq: ["x * 1 * 3 *y", "x * 3*y", "3xy"],
      ne: ["1 * x * 3"],
    },
  ],
};
