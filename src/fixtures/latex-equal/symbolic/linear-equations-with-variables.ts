export default {
  mode: "symbolic",

  tests: [
    {
      //only: true,
      // linear equations with 2 unknowns
      target: "y= \\frac{1}{2}x +5",
      eq: [
        // Multiply both sides of the equation by a non-zero number
        "-2y =-x -10",
        // Divide both sides of the equation by y
        "1=\\frac{x}{2y}+\\frac{5}{y}",
        // Combine several of the above
        "x-2y+z=z-10",
      ],
    },
    {
      // linear equations with 2 unknowns that are not x or y
      target: "a= \\frac{1}{2}b +5",
      eq: ["-2a =-b -10", "1=\\frac{b}{2a}+\\frac{5}{a}", "b-2a+c=c-10"],
    },
    {
      // linear equation in one variable
      target: "x=9",
      eq: ["30-2x=12"],
      ne: ["31-2x=12"],
    },
    {
      //only: true,
      target: "2x+3=8",
      eq: [
        "4x+6=16",
        // "2x=5"
      ],
      // ne: ["5x+6=16"],
    },
  ],
};
