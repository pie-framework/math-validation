export default {
  mode: "symbolic",
  tests: [
    {
      target: "\\log(x*y)",
      eq: [
        "\\log(x)+\\log(y)",
        "\\log_{10}(x)+\\log_{10}(y)",
        "\\log_{10}(x*y)",
      ],
      ne: ["\\log_{10}(x)", "\\log(a*b)"],
    },
    {
      target: "\\log(x/y)",
      eq: [
        "\\log(x)-\\log(y)",
        "\\log_{10}(x)-\\log_{10}(y)",
        "\\log_{10}(x/y)",
      ],
      ne: ["\\log_{10}(x)", "\\log(a/b)"],
    },
    {
      target: "\\log(x^y)",
      eq: ["y\\log(x)", "y\\log_{10}(x)", "\\log_{10}(x^y)"],
    },
    {
      target: "\\sqrt(-1)",
      eq: ["i"],
    },
  ],
};
