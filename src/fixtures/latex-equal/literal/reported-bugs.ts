export default {
  mode: "literal",
  tests: [
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "r=\\sqrt{\\frac{V}{7pi }}",
      eq: "\\sqrt{\\frac{V}{7pi }}=r",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "r=\\sqrt{2}",
      eq: "\\sqrt{2}=r",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\ne -5",
      eq: "-5\\ne x",
    },
    {
      //only: true,
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\approx y+z",
      eq: "y+z\\approx x",
    },
    {
      only: true,
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\napprox y+z",
      eq: "y+z\\napprox x",
    },
  ],
};
