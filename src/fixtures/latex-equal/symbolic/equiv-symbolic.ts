export default {
  mode: "symbolic",

  tests: [
    {
      target: " \\frac{1}{2}x +5-y",
      eq: ["-y+ \\frac{1}{2}x +5"],
    },
    {
      // equation with variable
      target: "y= \\frac{1}{2}x +5",
      eq: [
        // flip sides of equation
        "\\frac{1}{2}x +5 = y",
        // rearrange addends
        "y=5+ \\frac{1}{2}x",
        // rearrange fraction
        "y=\\frac{x}{2}+5",
        // express ½ as a decimal
        "y = 0.5x+5 ",
        // Use division sign rather than fraction form
        "y =x÷2 +5",
        // Multiply both sides of the equation by a non-zero number
        "-2y =-x -10",
        // Add a number to both sides of the equation
        "y-5 =\\frac{x}{2}",
        "-5 =\\frac{1}{2}x-y",
        // Subtract one of the variables from both sides of the equation
        "0=x/2-y+5",
        // Add a new variable to both sides of the equation
        "z=x/2-y+5 +z",
        // Divide both sides of the equation by y TO DO- equation is transformed in a quadratic eequation
         "1=\\frac{x}{2y}+\\frac{5}{y}",
        // Combine several of the above
        "x-2y+z=z-10",
      ],
      ne: [
        "\\frac{1}{2}x +5 = x",
        "y=6+ \\frac{1}{2}x",
        "y=\\frac{x+1}{2}+5",
        "y = 0.45x+5 ",
        "y =x÷2.1 +5",
      ],
    },
    {
      // equation with no variable
      target: "2+2=4",
      ne: ["1=1", "0.5=1/2", "9x=3(3x)"],
    },
    {
      // equation with no variable
      target: "4=4",
      eq: ["2+2=2+2"],
      ne: ["1=1", "0.5=1/2", "9x=3(3x)"],
    },
    // expressions (no equal or inequality sign)
    {
      target: "\\frac{1}{3}*(8c)-5",
      eq: [
        "-5 + \\frac{1}{3}*(8*c)",
        "8c\\frac{1}{3}-5",
        "\\frac{8c-15}{3}",
        "\\frac{1}{3}*8c-5",
        "(\\frac{1}{3})(8c)-5",
        "(1÷3)(8c)-5",
        // Validation is aware of i
        "\\frac{8c}{3}+5*i^2",
      ],
    },
    // trigonometric identities
    {
      target: "\\tan x",
      eq: ["\\frac{\\sin x}{\\cos x} "],
    },
    {
      target: "\\cot x",
      eq: ["\\frac{1}{\\frac{\\sin x}{\\cos x}} ", "\\frac{\\cos x}{\\sin x} "],
    },
    {
      target: "0",

      eq: [
        // validation handles radians
        "\\sin(2\\pi)",
        "\\sin(2\\π)",
        // validation handles degrees
        "\\sin(180°)",
      ],
    },
    {
      target: "1",
      eq: ["\\sin(90°)"],
    },
    {
      target: "-1",
      eq: ["\\cos(180°)"],
    },
    {
      target: "\\frac{\\sqrt2}{2}",
      eq: ["\\sin(45°)"],
    },
    {
      target: "2",
      eq: [
        // validation handles base 10 logs
        "\\log(100)",
        // Validation handles natural logs
        "2*\\ln(e)",
        // validation handles square roots
        "\\sqrt(4)",
        // Validation handles nth roots
        "\\sqrt[4](16)",
      ],
    },
  ],
};
