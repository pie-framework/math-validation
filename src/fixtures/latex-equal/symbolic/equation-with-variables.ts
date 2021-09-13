export default {
  mode: "symbolic",

  tests: [
    {
      //only: true,
      // linear equations
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
    // {
    //   only: true,
    //   // linear equations
    //   target: "a= \\frac{1}{2}b +5",
    //   eq: [
    //     // Multiply both sides of the equation by a non-zero number
    //     "-2a =-b -10",
    //     // Divide both sides of the equation by y
    //     "1=\\frac{b}{2a}+\\frac{5}{a}",
    //     // Combine several of the above
    //     "b-2a+c=c-10",
    //   ],
    // },
    {
      // only: true,
      // linear equation in one variable
      target: "x=9",
      eq: ["30-2x=12"],
      ne: ["31-2x=12"],
    },
    {
      // // quadratic equation
      //only: true,
      // target: "x^2-7x+10=0",
      // eq: ["2x^2-14x+20=0"],
    },
  ],
};
