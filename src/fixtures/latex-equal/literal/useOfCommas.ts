export default {
  mode: "literal",
  tests: [
    {
      // only: true,
      target: "1,000",
      eq: ["1000", "1,0,0,0"],

      ne: ["1,0,00", "1,0,0,0", "1,0,0,0,", "1000"],
    },
  ],
};
