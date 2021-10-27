export default {
  mode: "symbolic",
  tests: [
    {
      target: "y= \\frac{1}{2}x +5",
      eq: [
        // Multiply both sides of the equation by a non-zero number
        "-2y =-x -10",
        // Divide both sides of the equation by y
        "1=\\frac{x}{2y}+\\frac{5}{y}",
        // Combine several of the above
        "x-2y+z=z-10",
        // Multiply both sides of the equation by a variable
        "y^2=\\frac{xy}{2}+5y",
      ],
    },
    {
      // linear equations with 2 variables that are not x or y
      target: "a=\\frac{1}{2}b +5",
      eq: [
        "-2a =-b -10",
        "1=\\frac{b}{2a}+\\frac{5}{a}",
        "b-2a+c=c-10",
      ],
    },
    {
      // linear equations with 2 variables that are not x or y
      target: "a=\\frac{1}{2}b +5",
      eq: [
        "-2a =-b -10",
        "1=\\frac{b}{2a}+\\frac{5}{a}",
        "b-2a+c=c-10",
      ],
    },
    {
      // Multiply both sides of the equation by a variable
      target: "x+2y=7",
      eq: ["x*x+2yx-7x=0"],
    },
    {
      // Multiply both sides of the equation by a variable
      target: "x+2y=7",
      eq: ["x^2+2yx-7x=0"],
    },
    {
      //  Divide both sides of the equation by a variable
      target: "x+2y=7",
      eq: ["\\frac{x}{y}+2-7/y=0", "\\frac{x}{x}+\\frac{2y}{x}=\\frac{7}{x}"],
    },
  ],
};
