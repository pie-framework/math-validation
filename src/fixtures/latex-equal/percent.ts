export default {
  mode: "symbolic",
  label: "CH6456",
  skip: true,
  tests: [
    {
      label: "we have percent support in math-expressions - port",
      target: "-12.5%",
      eq: ["-12.5%", "-12.5\\%"],
      ne: ["-11.5%"],
    },
    {
      target: "\\frac{2}{4} -12.5%",
      eq: ["\\frac{1}{2} - 12.5%", "\\frac{10}{20}-12.5\\%"],
    },
  ],
};