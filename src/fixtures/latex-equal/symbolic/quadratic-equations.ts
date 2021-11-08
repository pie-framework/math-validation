export default {
  mode: "symbolic",
// only: true,
  tests: [
    {
      target: "x^2-7x+10=0",
      eq: ["2x^2-14x+20=0"],
    },
    {
      target: "5x^2+20x+32=0",
      eq: [
        "10x^2+40x+64=0", 
        "15x^2+60x+96=0"
      ],
    },
    {
      target: "x^2 + 3x +2 = 5x +10",
      eq: ["(x+2)(x-4)=0", "x^2-4x+2x-8=0"],
      ne: ["(x+1)(x-4)=0", "(x)(x-4)=0", "x^2-4x+2x-8"],
    },
    {
      target: "x^2 = 5x - 6",
      eq: ["x^2 - 5x + 6=0", "(x-3)(x-2)=0"],
      ne: ["(x-3)(x-1)=0", "(x)(x-3)=0", "x^2-5x - 6 = 0"],
    },
    {
      target: "6x^2-3x-2x +1 =0",
      eq: ["3x(2x-1)-1(2x-1)=0", "(3x-1)(2x-1)=0"],
      ne: ["3x(2x)-1(2x-1)=0", "(3x-1)(2x)=0"],
    },
    {
      target: "6x^2+4x+2=0",
      eq: [
        "3x^2+2x+1=0",
        "x^2+\\frac{2x}{3}+\\frac{1}{3}=0",
        "x^2+\\frac{2x}{3}+\\frac{2}{6}=0",
      ],
      ne: [
        "x^2+\\frac{2x}{3}+\\frac{2}{4}=0",
        "x^2+\\frac{2x}{3}+\\frac{2}{5}=0",
        "x^2+\\frac{2x}{3}+\\frac{2}{3}=0",
      ],
    },
    {
    //  only:true,
      target: "3x^2-18x+14=0",
      eq: [
        "3(x^2-6x)+14=0",
        "3(x^2-6x +3^2-3^2)=-14",
        "3(x^2-6x+3^2)-3(9)+14=0",
        "3(x-3)^2-13=0",
      ],
    },
    {
      target: "(t-5)^2-9=0",
      eq: ["(t-5)^2=9"],
      ne: ["(t-5)^3=9", "(x-5)^2=9", "(t-4)^2=9"],
    },
    // {
    //   target: "\\frac{6}{x^2}+\\frac{1}{x}+2=0",
    //   eq: [
    //     "\\frac{6}{x^2}+\\frac{2}{2x}+2=0",
    //     "\\frac{6}{x^2}+\\frac{1}{x}+2=0",
    //     "\\frac{6}{(x+1)(x+1)}+\\frac{2}{2x}+2=0",
    //     "\\frac{6}{x(x+1)+1(x+1)}+\\frac{5}{5(x+1)}=1",
    //     "\\frac{6}{x^2+x+1(x+1)}+\\frac{5}{5(x+1)}=1",
    //   ],
    // },
    // {
    //   target: "\\frac{6}{(x+1)^2}+\\frac{1}{x+1}=1",
    //   eq: [
    //     "\\frac{6}{(x+1)^2}+\\frac{5}{5(x+1)}=1",
    //     "\\frac{6}{(x+1)(x+1)}+\\frac{5}{5(x+1)}=1",
    //     "\\frac{6}{x(x+1)+1(x+1)}+\\frac{5}{5(x+1)}=1",
    //     "\\frac{6}{x^2+x+1(x+1)}+\\frac{5}{5(x+1)}=1",
    //   ],
    // },
    {
      // test square props
      target: "(u+1)^2=0",
      eq: [
        // expand square
        "(u+1)(u+1)=0",
         // distributive property
        "u(u+1)+1(u+1)=0",
        "u^2+u+1(u+1)=0",
      ],
    },
    {
      // test square props
      target: "(z-1)^2=0",
      eq: [
        // expand square
        "(z-1)(z-1)=0",
        // distributive property
        "z(z-1)-1(z-1)=0",
        "z*z+z*(-1)-1(z-1)=0",
        "z*z+z*(-1)-1z-1*(-1)=0",
        "z^2-2z+1=0",
      ],
    },
    {
      // they both have complex solutions but they should not be equal
      target: "4x^2-5x+17=0",
      ne: ["2x^2+6x+8=0"],
    },
  ],
};
