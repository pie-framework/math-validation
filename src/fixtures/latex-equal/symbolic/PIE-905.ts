// numbers that differ from the target by less than 0.00005 must not be scored as equal
export default {
  mode: "symbolic",
  tests: [
    {
      target: "800",
      eq: ["800.0", "800.00", "400*2", "\\frac{1600}{2}"],
      ne: ["800.00001", "799.99999", "800.0001"],
    },
    {
      target: "800",
      mode: "literal",
      ne: ["800.00001"],
    },
    {
      target: "-800",
      eq: ["-800.0", "-400*2"],
      ne: ["-800.00001", "-799.99999"],
    },
    {
      target: "100",
      eq: ["10^2", "100.000"],
      ne: ["100.000001"],
    },
    {
      target: "10^2",
      eq: ["100"],
      ne: ["100.00001"],
    },
    {
      target: "1000000",
      ne: ["1000000.0001"],
    },
    {
      target: "\\sqrt{2}",
      eq: ["\\frac{2}{\\sqrt{2}}", "\\sin(45°)\\cdot 2"],
      ne: ["1.4142", "1.41421356237"],
    },
    {
      target: "\\frac{\\sqrt{3}}{2}",
      eq: ["\\sin(60°)", "\\cos(30°)", "\\sin(\\frac{\\pi}{3})"],
      ne: ["0.866", "0.86603"],
    },
  ],
};
