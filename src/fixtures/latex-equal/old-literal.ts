/**
 * These are carried over from pie-elements/math-inline,
 * to ensure this library is consistent
 *
 * TODO: carry move over from: https://github.com/pie-framework/pie-elements/blob/develop/packages/math-inline/controller/src/__tests__/index.test.jsx#L400
 */
export default {
  mode: "literal",
  skip: false,
  tests: [
    { target: "1,000", eq: ["1000"] },
    {
      target: "1.00",
      eq: ["1"],
      opts: {
        literal: { allowTrailingZeros: true },
      },
    },
    { target: "1.01", eq: ["1.01"] },
    {
      target: "72\\div12=6\\text{eggs}",
      eq: [
        "72\\div12=6\\text{eggs}",
        " 72\\div12=6\\text{eggs} ",
        " 72 \\div 12= 6 \\text{eggs} ",
      ],
      ne: [],
    },
    { target: "6=72\\div12\\text{eggs}" },
    { target: "\\frac{72}{12}=6\\text{eggs}" },
    { target: "6=\\frac{72}{12}\\text{eggs}" },
  ],
};
