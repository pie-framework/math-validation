export default {
  mode: "symbolic",
  tests: [
    {
      target: "x=9",
      eq: ["30-2x=12", "10+10-3x+x+10=12", "\\frac{1}{x}=\\frac{1}{9}"],
      ne: ["31-2x=12"],
    },
    {
      target: "a=9",
      eq: ["30-2a=12"],
      ne: ["31-2x=12", "b=9"],
    },
    {
      // infinite solutions equations
      target: "a=a",
      eq: ["2a=2a"],
      ne: ["12=12"],
    },
    {
      // infinite solutions equations
      target: "5c+5c=5c+5c",
      eq: ["10c=10c", "c=c"],
      ne: ["12=12"],
    },
    {
      // if equations have no solutions they will not be equivalent
      target: "x=x+2",
      ne: ["2x=2x+4"],
    },
    {
      target: "q=9",
      eq: ["15-q-6=0"],
      ne: ["31-2q=12", "qa=9", "q=q"],
    },
    {
      target: "2x+3=8",
      eq: [
        "4x+6=16",
        "2x=5",
        "x=2.5",
        "x=\\frac{5}{2}",
        "2.500000=x",
        "2x+3-8=0",
        "2x+3-8-m=0-m",
      ],
      ne: ["5x+6=16", "2x+4-8=0", "x+3=4"],
    },
    {
      target: "4x+2=6x-4",
      eq: ["-2x+6=0"],
    },
  ],
};
