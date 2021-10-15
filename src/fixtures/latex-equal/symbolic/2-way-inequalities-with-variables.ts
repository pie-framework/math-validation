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
    {
      target: "\\frac{2x+4}{10}>4",
      eq: ["\\frac{x+2}{5}>4", "\\frac{x}{5}+\\frac{2}{5}>4"],
      ne: ["\\frac{x+3}{5}>4", "\\frac{2x}{5}+\\frac{2}{5}>4"]
    },
    {
     // only:true,
      target: "\\frac{(2x-3)+9(4)}{4}≥\\frac{9+4x}{3}",
      eq: ["\\frac{2x-3+36}{4}≥\\frac{9+4x}{3}", "\\frac{2x+33}{4}≥\\frac{9+4x}{3}"],
      ne: [
        "\\frac{2x+3+36}{4}≥\\frac{9+4x}{3}", 
        "\\frac{2x-33}{4}≥\\frac{9+4x}{3}"
      ],
    },
    {

      target: "\\frac{5x-2}{3}-\\frac{7x-3}{5}>\\frac{x}{4}",
      eq: ["\\frac{5(5x-2)-3(7x-3)}{15}>\\frac{x}{4}"],
      ne: ["\\frac{5.1(5x-2)-3(7x-3)}{15}>\\frac{x}{4}"],
    },
    {
      target: "\\frac{x}{4}+1>\\frac{1}{2}",
      eq: ["\\frac{x*4}{4}+1*4>\\frac{1*4}{2}", "x+4>2","x>-2"],
      ne: ["x>-1","x≥-2"]
    },
  ],
};
