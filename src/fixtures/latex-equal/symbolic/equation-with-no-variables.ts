export default {
  mode: "symbolic",
  tests: [
    { target: "2+2=4", ne: ["1", "2=2"] },
    {
      target: "4=4",
      eq: ["4=4", "2+2=4"],
      ne: ["1", "3=3", "9=8", "a=b", "0=0", "\\true=\\true"],
    },
    {
      target: "4=4=2+2",
      eq: ["4=4=4+0", "2+1+1=2+2=4"],
      ne: ["1", "3=3=3", "a=b=c"],
    },
    { target: "1=1", ne: ["1", "2=2"] },
  ],
};
