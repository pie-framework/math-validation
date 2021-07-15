export default {
  mode: "symbolic",
  tests: [
    {
      target: "9x^2-24xy+16y^2",
      eq: ["16y^2+9x^2-24xy", "16y^2-24xy+9x^2"],
    },
    {
      target: "9x^2-24xy-16y^2",
      eq: ["-16y^2+9x^2-24xy", "-16y^2-24xy+9x^2"],
    },
  ],
};
