export default {
  mode: "symbolic",
  tests: [
    {
      only: true,
      // "x/12 * 7": "7/12 * x",
      target: "\\frac{x}{12}\\times7\\text{dollars}",
      eq: [
        "\\frac{7x}{12}\\ \\text{dollars}",
        // "x\\times \\frac{1}{12}\\times 7\\ \\text{dollars}",
        // "x\\times 7\\times \\frac{1}{12}\\ \\text{dollars}",
        // "\\frac{1}{12}\\times x\\times 7\\ \\text{dollars}",
        // "\\frac{7}{12}\\times x\\ \\text{dollars}",
        // "\\frac{1}{12}x\\times 7\\ \\text{dollars}",
        // "\\frac{1}{12}\\left(7x\\right)\\ \\text{dollars}",
        // "\\frac{1}{12}\\left(x\\times 7\\right)\\ \\text{dollars}",
      ],
    },
  ],
};
