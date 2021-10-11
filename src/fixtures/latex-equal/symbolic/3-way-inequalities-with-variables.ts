export default {
  mode: "symbolic",
  tests: [
    {
     // only:true,
      // 3-way inequality with variable(s)
      target: "1<2x ≤ 3",
      eq: [
        "3 ≥ 2x>1",
        "x/x<x+x≤1.5*2",
        "1/2<x ≤1.5"
      ],
    },
  ],
};
