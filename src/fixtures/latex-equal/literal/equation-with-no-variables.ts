export default {
  mode: "literal",
  //only: true,
  tests: [
    { target: "2+2=4", ne: ["1", "2=2"] },
    { target: "4=4", eq: "4=4", ne: ["1"] },
    { target: "1=1", ne: ["1", "2=2"] },
  ],
};
