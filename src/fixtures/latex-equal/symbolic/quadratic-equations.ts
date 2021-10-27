export default {
  mode: "symbolic",
//only: true,
  // equivalence is true when it should not be for for quadratic equations
  tests: [
    {
      target: "x^2-7x+10=0",
      eq: ["2x^2-14x+20=0"],
    },
    {
    //  only:true,
      target: "x^2 + 3x +2 = 5x +10",
      eq: [
        "(x+2)(x-4)=0",
         "x^2-4x+2x-8=0"
        ],
      ne: [
        "(x+1)(x-4)=0",
        "(x)(x-4)=0",
        "x^2-4x+2x-8",
      ],
    },
    {
      target: "x^2 = 5x - 6",
      eq: ["x^2 - 5x + 6=0", "(x-3)(x-2)=0"],
      ne: ["(x-3)(x-1)=0", "(x)(x-3)=0", "x^2-5x - 6 = 0"],
    },
    {
      target: "6x^2-3x-2x +1 =0",
      eq: ["3x(2x-1)-1(2x-1)=0", "(3x-1)(2x-1)=0"],
      ne:["3x(2x)-1(2x-1)=0", "(3x-1)(2x)=0"]
    },
  ],
};
