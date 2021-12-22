export default {
  mode: "symbolic",
  tests: [
    {
      target: "\\log (x)",
      eq: ["\\log_{10}(x)", "\\log x"],
      ne: ["\\log_{3}(x)"],
    },
    {
      target: "\\log (x)",
      eq: ["\\log_{10}(x)", "\\log x"],
    },
    {
      target: "\\log (y)",
      eq: ["\\log_{10}(y)", "\\log y"],
    },
    {
      target: "\\log x",
      eq: ["\\log_{10}(x)", "\\log(x)"],
    },
    {
      target: "\\log x +\\log y ",
      eq: ["\\log(x) + \\log(y)"],
    },
    {
      target: "\\ln_{e} (x)",
      eq: ["\\log_{e}(x)", "\\log_{e} x"],
      ne: ["\\log_{10}(x)"],
    },
  ],
};
