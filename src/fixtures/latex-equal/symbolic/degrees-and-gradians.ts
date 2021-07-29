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
      //only: true,
      target: "\\frac{1}{2}",
      eq: ["\\sin(30°)", "\\cos(60°)"],
    },
    {
      //only: true,
      target: "1/2",
      eq: ["0.5"],
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
      target: "\\sqrt(2)",
      eq: ["\\csc (45°)", "\\sec(45°)"],
    },
    {
      target: "\\sqrt(3)",
      eq: ["\\tan (60°)", "\\cot(30°)"],
    },
    {
      target: "\\frac{\\sqrt(3)}{2}",
      eq: ["\\sin (60°)", "\\cos(30°)"],
    },
    {
      target: "-1",
      eq: ["\\sin (270°)", "\\cos(180°)", "\\csc(270°)", "\\sec(180°)"],
    },
    {
      target: "2",
      eq: ["\\csc (30°)", "\\sec(60°)"],
    },
    {
      //only: true,
      target: "\\Infinity",
      eq: [
        "\\tan(90°)",
        "\\tan(270°)",
        "\\cot(0°)",
        "\\cot(180°)",
        "\\cot(360°)",
        "\\csc(0°)",
        "\\csc(180°)",
        "\\csc(360°)",
        "\\sec(90°)",
        "\\sec(270°)",
      ],
    },
  ],
};
