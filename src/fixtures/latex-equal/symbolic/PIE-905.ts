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
    // values below 1 need the same number of matching digits as larger ones
    {
      target: "\\frac{1}{3}",
      eq: ["\\frac{2}{6}"],
      ne: ["0.333333333333", "0.3333"],
    },
    {
      target: "\\frac{1}{7}",
      ne: ["0.142857142857", "0.142857"],
    },
    {
      target: "0",
      eq: ["\\sin(2\\pi)", "\\cos(270°)", "\\sin(3600°)"],
      ne: ["0.0000000000001", "0.00001"],
    },
    // floating-point noise from pi and angle conversions is still accepted
    {
      target: "0.5",
      eq: ["\\sin(30°)", "\\cos(60°)", "-\\cos(\\frac{2\\pi}{3})"],
    },
    {
      target: "\\sqrt{3}",
      eq: ["\\tan(60°)"],
    },
    {
      target: "0.3",
      eq: ["0.1+0.2"],
    },
    {
      target: "1000",
      eq: ["1000\\tan(45°)"],
    },
    // angles in degrees, radians and gradians are converted with the exact value of pi
    {
      target: "30°",
      eq: ["\\arcsin(0.5)"],
    },
    {
      target: "\\frac{\\pi}{2}",
      eq: ["90°", "100\\grad"],
    },
    {
      target: "\\pi",
      eq: ["180°"],
    },
  ],
};
