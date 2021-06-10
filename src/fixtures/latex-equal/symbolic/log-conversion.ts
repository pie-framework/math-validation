export default {
  mode: "symbolic",
  tests: [
    {
      target: "\\log (x)",
      eq: ["\\log_{10}(x)", "\\log x"],
      ne: ["\\log_{3}(x)"],
    },
    {
      target: "\\ln_{e} (x)",
      eq: ["\\log_{e}(x)", "\\log_{e} x"],
      ne: ["\\log_{10}(x)"],
    },
  ],
};
