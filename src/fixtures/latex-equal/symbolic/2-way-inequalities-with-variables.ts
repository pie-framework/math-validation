export default {
  mode: "symbolic",
  tests: [
    {
      // 2-way inequality with variable(s)
      target: "2x<4",
      eq: [
        "4>2x",
        "x+x < 2*2",
        "x<2",
      ],
    },
    {
      target: "2x≤4",
      eq: [
        "4≥2x",
        "x+x ≤ 2*2",
        "x≤2",
      ],
      ne: ["x<2", "3x≤4"]
    },
    {
         target: "2x<4",
         eq: [
           "4>2x",
           "x+x < 2*2",
           "x<2",
         ],
       },
       {
         target: "2x+y≤4+y",
         eq: [
           "4≥2x",
           "x+x ≤ 2*2",
           "4x≤8",
         ],
         ne: ["x<2", "3x≤4", "x<3"]
       },
       {
        target: "2x+3y≤4+y",
        eq: [
          "4+y≥2x+3y",
          "x+x +3y≤ 2*2 +y",
          "4x+6y≤8+2y",
        ],
        ne: ["x<2", "3x≤4", "x<3"]
      },
  ],
};
