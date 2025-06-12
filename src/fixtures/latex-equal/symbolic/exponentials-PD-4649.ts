export default {
  mode: "symbolic",
  tests: [
    // Cases where symbolic validation failed before

    {
      target: "B=500(\\frac{3}{4})^n",
      ne: ["B=500(\\frac{1}{4})^{n-1}"],
    },
    {
      target: "y=500(\\frac{3}{4})^n",
      ne: ["y=500(\\frac{1}{4})^{n-1}"],
    },
    {
      target: "a=500(\\frac{3}{4})^d",
      ne: ["a=(\\frac{1}{4})^{d-1}"],
    },
    {
      target: "b=500(\\frac{3}{4})^d",
      ne: ["b=(\\frac{1}{4})^{d-1}"],
    },
    {
      target: "f=4^g",
      ne: ["f=4^{g-1}"],
    },
    {
      target: "h=4^g",
      ne: ["h=4^{g-1}"],
    },

    // Control test — should NOT be equal when using multiplication instead of exponentiation
    {
      target: "a=4*g",
      ne: ["a=4*(g-1)"],
    },

    // Valid symbolic equivalence (should return true)
    {
      target: "x=3^n",
      eq: ["x=3^n"],
    },
    {
      target: "z=2^y",
      eq: ["z=2^y"],
    },
    {
      target: "v=(\\frac{5}{2})^x",
      eq: ["v=(\\frac{5}{2})^x"],
    },
    {
      target: "m=(\\frac{3}{4})^a",
      eq: ["m=(\\frac{3}{4})^a"],
    },
    {
      target: "k=(1.5)^p",
      eq: ["k=(1.5)^p"],
    },
  ],
};
