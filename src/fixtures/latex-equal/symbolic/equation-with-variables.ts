export default {
  mode: "symbolic",

  tests: [
    {
      //only: true,
      target: "y= \\frac{1}{2}x +5",
      eq: [
        // Multiply both sides of the equation by a non-zero number
        "-2y =-x -10",
        // // Divide both sides of the equation by y
        "1=\\frac{x}{2y}+\\frac{5}{y}",
        // Combine several of the above
        "x-2y+z=z-10",
      ],
    },
    {
      //only: true,
      target: "x=-9",
      eq: ["30-2x=12"],
      ne: ["31-2x=12"],
    },
  ],
};
