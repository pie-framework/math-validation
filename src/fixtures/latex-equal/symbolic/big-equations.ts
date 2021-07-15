export default {
  mode: "symbolic",
  tests: [
    {
      only: true,

      //target: `x=\sin^{-1}\\left(\\frac{1}{n}\\right) + 2^5 \\frac{1}{2} - \\(left 3 + 3 + a * y \\right)`,
      target: `x=\\sin^{-1}\\left(\\frac{1}{n}\\right) + 2^5  \\sin^{-1}\\left(\\frac{1}{n}\\right) + 2^5`,
      eq: [
        `x=\\sin^{-1}\\left(\\frac{1}{n}\\right) + 2^3  \\sin^{-1}\\left(\\frac{1}{n}\\right) + 2^5`,
      ],
    },
  ],
};
