export default {
  mode: "symbolic",
  tests: [
     {
      target: "\\left(\\frac{1}{2}\\right)^n",
      eq: ["\\left(\\frac{10}{20}\\right)^n"],
    },
    {
      target: "\\left(\\frac{1}{2}\\right)^n",
      eq: ["\\left(0.5\\right)^n"],
    },
    {
      target: "\\left(\\frac{1}{2}\\right)^n",
      eq: ["\\left(\\frac{2}{4}\\right)^n"],
    },
    {
      target: "\\left(\\frac{10}{20}\\right)^n",
      eq: ["\\left(\\frac{1}{2}\\right)^n"],
    },
    {
      target: "\\left(0.5\\right)^n",
      eq: ["\\left(\\frac{1}{2}\\right)^n"],
    },
    {
      target: "\\left(\\frac{3}{2}\\right)^a",
      eq: ["\\left(\\frac{6}{4}\\right)^a"],
    },
    {
      target: "\\left(\\frac{3}{2}\\right)^a",
      eq: ["\\left(1.5\\right)^a"],
    },
    {
      target: "\\left(\\frac{1}{2}\\right)^n",
      eq: ["\\left(1\\div2\\right)^n"],
    },

    // Division written with \left and \right — also should be equivalent

    {
      target: "\\left(1\\div2\\right)^n",
      eq: ["\\left(10\\div20\\right)^n"],
    },
    {
      target: "\\left(1\\div2\\right)^n",
      eq: ["\\left(0.5\\right)^n"],
    },
    {
      target: "\\left(1\\div2\\right)^n",
      eq: ["\\left(2\\div4\\right)^n"],
    },
    {
      target: "\\left(10\\div20\\right)^n",
      eq: ["\\left(1\\div2\\right)^n"],
    },
    {
      target: "\\left(0.5\\right)^n",
      eq: ["\\left(1\\div2\\right)^n"],
    },
    {
      target: "\\left(3\\div2\\right)^n",
      eq: ["\\left(6\\div4\\right)^n"],
    },
    {
      target: "\\left(3\\div2\\right)^n",
      eq: ["\\left(1.5\\right)^n"],
    },
    // All of the following SHOULD be considered equivalent (eq)

    {
      target: "(\\frac{1}{2})^n",
      eq: ["(\\frac{10}{20})^n"],
    },
    {
      target: "(\\frac{1}{2})^n",
      eq: ["(0.5)^n"],
    },
    {
      target: "(\\frac{1}{2})^n",
      eq: ["(\\frac{2}{4})^n"],
    },
    {
      target: "(\\frac{10}{20})^n",
      eq: ["(\\frac{1}{2})^n"],
    },
    {
      target: "(0.5)^n",
      eq: ["(\\frac{1}{2})^n"],
    },
    {
      target: "(\\frac{3}{2})^a",
      eq: ["(\\frac{6}{4})^a"],
    },
    {
      target: "(\\frac{3}{2})^a",
      eq: ["(1.5)^a"],
    },
    {
      target: "(\\frac{1}{2})^n",
      eq: ["(1\\div2)^n"],
    },

    // Control set – same expressions using division
    {
      target: "(1\\div2)^n",
      eq: ["(10\\div20)^n"],
    },
    {
      target: "(1\\div2)^n",
      eq: ["(0.5)^n"],
    },
    {
      target: "(1\\div2)^n",
      eq: ["(2\\div4)^n"],
    },
    {
      target: "(10\\div20)^n",
      eq: ["(1\\div2)^n"],
    },
    {
      target: "(0.5)^n",
      eq: ["(1\\div2)^n"],
    },
    {
      target: "(3\\div2)^n",
      eq: ["(6\\div4)^n"],
    },
    {
      target: "(3\\div2)^n",
      eq: ["(1.5)^n"],
    },
  ],
};
