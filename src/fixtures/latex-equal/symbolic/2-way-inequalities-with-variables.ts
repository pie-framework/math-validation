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
      // only:true,
        target: "2x<4",
        eq: [
          "4>2x",
          "x+x < 2*2",      
        ],
        // this is a problem, when multiplying both parts with a negative number, direction should be changed, expressions should not be equivalent anymore  
        ne: ["x*(-1)<2*(-1)"]
      },
      {
        // only:true,
          target: "2x>4",
          eq: [
            "4<2x",
            "x+x > 2*2",      
          ],
          // this is a problem, when multiplying both parts with a negative number, direction should be changed, expressions should not be equivalent anymore  
          ne: ["x*(-1)>2*(-1)"]
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
        ne: ["x+y<2", "3x+2y≤4", "x+4y≤3"]
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
  ],
};
