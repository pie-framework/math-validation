export default {
  // only: true,
  mode: "symbolic",
  tests: [
    {
      //only: true,
      target: "0",
      eq: [
        "\\sin (2\\pi)",
        "\\sin(180°)",
        "\\sin(0°)",
        "\\sin(360°)",
        "\\cos(90°)",
        "\\cos(270°)",
        "\\tan(0°)",
        "\\tan(180°)",
        "\\tan(360°)",
        "\\cot(90°)",
        "\\cot(270°)",
      ],
      ne: ["0.000000001"],
    },
    {
      target: "\\frac{1}{2}",
      eq: ["\\sin(30°)"],
    },
    {
      target: "1",
      eq: [
        "\\sin (90°)",
        "\\cos(0°)",
        "\\cos(360°)",
        "\\tan(45°)",
        "\\cot(45°)",
        "\\csc(90°)",
        "\\sec(0°)",
        "\\sec(360°)",
      ],
    },
    {
      target: "\\frac{1}{\\sqrt(2)}",
      eq: ["\\sin (45°)", "\\cos(45°)"],
    },
    {
      target: "\\frac{1}{\\sqrt(3)}",
      eq: ["\\tan (30°)", "\\cot(60°)"],
    },
    {
      target: "\\frac{2}{\\sqrt(3)}",
      eq: ["\\csc (60°)", "\\sec(30°)"],
    },
    {
      target: "\\sqrt(3)",
      eq: ["\\tan (60°)", "\\cot(30°)"],
    },
  ],
};
