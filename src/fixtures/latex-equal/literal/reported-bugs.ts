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
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\approx y+z",
      eq: "y+z\\approx x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\napprox y+z",
      eq: "y+z\\napprox x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≈ y+z",
      eq: "y+z≈ x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≉ y+z",
      eq: "y+z≉ x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\sim -5",
      eq: "-5\\sim x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x~ y+z",
      eq: "y+z~ x",
    },
    {
      only: true,
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\simeq y+z",
      eq: "y+z\\simeq x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≃ y+z",
      eq: "y+z≃ x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\nsim -5",
      eq: "-5\\nsim x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≁ y+z",
      eq: "y+z≁ x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\cong y+z",
      eq: "y+z\\cong x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≅ y+z",
      eq: "y+z≅ x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≆ y+z",
      eq: "y+z≆ x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x\\ncong y+z",
      eq: "y+z\\ncong x",
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "x≆ y+z",
      eq: "y+z≆ x",
    },
  ],
};
