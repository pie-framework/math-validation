export default {
  //skip: true,
  mode: "symbolic",
  tests: [
    {
      target: "f^{-1}\\left(x\\right)=-\\frac{12}{x}+8",
      eq: [
        "f^{-1}(x)\\ =\\ 8-\\frac{12}{x}",
        "f^{-1}(x)\\ =\\ \\frac{8x-12}{x}",
        "f^{-1}(x)\\ =\\ \\frac{-12+8x}{x}",
        "f^{-1}(x)\\ =\\ -12\\left(\\frac{1}{x}\\right)+8",
        "f^{-1}(x)\\ =\\ 8-12\\left(\\frac{1}{x}\\right)",
      ],
    },
    {
      target: "g^{-1}\\left(x\\right)= a+b+c",
      eq: ["a+c+b=g^{-1}\\left(x\\right)"],
    },
  ],
};
