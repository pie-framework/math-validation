export default {
  mode: "symbolic",
  label: "CH6456",
  tests: [
    {
      target: "-12.5%",
      eq: ["-12.5%", "-12.5\\%"],
      ne: ["-11.5%", "12.5\\%"],
    },
    {
      target: "\\frac{2}{4} -12.5%",
      eq: ["\\frac{1}{2} - 12.5%", "\\frac{10}{20}-12.5\\%"],
      ne: ["\\frac{4}{2} -12.5%", "\\frac{2}{2} -12.5%"],
    },
  ],
};
