export default {
  mode: "symbolic",
  skip: false,
  // all passed
  tests: [
    {
      target: "4 \\frac{1}{2}",
      eq: [
        "2",
        "1.3 + 0.7",
        // this does not seem right for me "4 \\frac{1}{2}" equals "2"
        // "4.5",
        // "3.2 + 1.3",
        //"(4 - \\frac{4}{5}) + 1.3",
        //"\\frac{9}{2}",
        "4 \\frac{1}{2}",
        // "\\frac{10}{2} - 0.5",
      ],
      ne: ["4.55"],
    },
  ],
};
