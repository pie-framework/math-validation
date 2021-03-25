export default {
  mode: "symbolic",
  skip: true,
  tests: [
    {
      target: "m=50\\cos\\left(\\frac{2\\pi}{30}d\\right)+50",
      eq: [
        "m=50\\cos\\left(\\frac{\\pi\\ }{15}d\\right)+50",
        "m=50\\cos\\left(\\frac{1}{15}\\pi\\ d\\right)+50",
        "m=50\\cos\\left(d\\right)+50",
      ],
    },
    {
      target: "y=250\\sin\\left(\\frac{2\\pi}{5}x\\right)+2500",
      eq: [
        "y=250\\sin\\left(\\frac{2}{5}\\pi\\ x\\right)+2500",
        "y=250\\sin\\left(\\left(\\frac{2}{5}\\pi\\ \\right)x\\right)+2500",
        "y=250\\sin\\left(\\left(\\frac{2\\pi\\ }{5}\\right)x\\right)+2500",
        "y=250\\sin\\left(\\frac{2\\pi\\ }{5}x\\right)+2,500",
        "y=250\\sin\\left(\\frac{2}{5}\\pi\\ x\\right)+2,500",
        "y=250\\sin\\left(\\left(\\frac{2}{5}\\pi\\ \\right)x\\right)+2,500",
        "y=250\\sin\\left(\\left(\\frac{2\\pi\\ }{5}\\right)x\\right)+2,500",
      ],
    },
  ],
};
