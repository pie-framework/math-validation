export default {
  mode: "symbolic",
  tests: [
     // 2-way inequalities in one variable
    {
      target: "2x<4",
      eq: ["4>2x", "x+x < 2*2", "x<2"],
      ne: ["x*(-1)<2*(-1)"],
    },
    {
      target: "2x≤4",
      eq: ["4≥2x", "x+x ≤ 2*2", "x≤2"],
      ne: ["x<2", "3x≤4", "x*(-1)≤2*(-1)", "2x≥4", "2x=4"],
    },
    {
      target: "2x>4",
      eq: ["4<2x", "x+x > 2*2"],
      ne: ["x*(-1)>2*(-1)", "2x<4", "2x=4"],
    },
    {
      target: "2x≥4",
      eq: ["4≤2x", "x+x ≥ 2*2"],
      ne: ["x*(-1)≥2*(-1)"],
    },
    {
      target: "2x+y≤4+y",
      eq: ["4≥2x", "x+x ≤ 2*2", "4x≤8", "2x+y-y-4≤0"],
      ne: ["x<2", "3x≤4", "x<3",  "-2x-y≤-4-y"],
    },
    // 2-way inequalities in two variables
    {
      target: "2x+3y≤4+y",
      eq: ["4+y≥2x+3y", "x+x +3y≤ 2*2 +y", "4x+6y≤8+2y"],
      ne: [
        "x+y<2", "3x+2y≤4", "x+4y≤3",
         "-2x-3y≤-4-y"
        ],
    },
    {
      target: "5.5x + 8y≥100",
      eq: [
        "11x+16y≥200",
        "5.5x + 8y+10≥100+10",
        "5.5x + 8y+z≥100+z",
        "(5.5x + 8y)*2≥100*2",
        "5.5x + 8y -100≥0",
        "(5.5x + 8y)≥100",
      ],
    },
    {
      target: "2x + 3y≥7",
      eq: [
        "x + 1.5y≥3.5",
        "3x + 6y≥14-x",
        "-2x-3y≤-7"
      ],
      ne: ["-2x-3y≥-7",  "3x + 6y≤14-x","x + 1.5y≤3.5","x + 1.5y=3.5"]
    },
  ],
};
