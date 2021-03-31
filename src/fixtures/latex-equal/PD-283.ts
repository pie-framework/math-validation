export default {
  mode: "literal",
  skip: false,
  tests: [
    {
      ignoreOrder: true,
      target: "a+b+10",
      eq: ["a+10+b", "10+a+b", "10+b+a", "b+a+10", "b+a+10"],
    },
    {
      ignoreOrder: false,
      target: "a+b+10",
      ne: ["a+10+b", "10+a+b", "10+b+a", "b+a+10", "b+a+10"],
    },
    {
      ignoreOrder: true,
      target: "0<x≤4",
      eq: ["4≥x>0"],
    },
    {
      ignoreOrder: false,
      target: "0<x<=4",
      ne: ["4≥x>0"],
    },
  ],
};
