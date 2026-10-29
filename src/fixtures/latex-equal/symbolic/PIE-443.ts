// two-variable equations with powers: changing a number or an exponent must make the answer incorrect
// targets are the correct answers of items E217532, E232686, E234938 and E234162; ne are the changes reported in PIE-443
export default {
  mode: "symbolic",
  tests: [
    {
      label: "E217532: $target",
      target:
        "\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{9}=1",
      eq: [
        "\\frac{y^2}{16}-\\frac{(x+2)^2}{9}=1",
        "-\\frac{(x+2)^2}{9}+\\frac{y^2}{16}=1",
        "1=\\frac{y^2}{16}-\\frac{(x+2)^2}{9}",
        "9y^2-16(x+2)^2=144",
        "9y^2-16x^2-64x-64=144",
        "9y^2-16x^2-64x-208=0",
        "\\frac{(x+2)^2}{9}-\\frac{y^2}{16}=-1",
      ],
      ne: [
        // change either or both of the exponents
        "\\frac{\\left(y+0\\right)^3}{16}-\\frac{\\left(x+2\\right)^2}{9}=1",
        "\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^3}{9}=1",
        "\\frac{\\left(y+0\\right)^3}{16}-\\frac{\\left(x+2\\right)^3}{9}=1",
        // change y+0 to 2y+4
        "\\frac{\\left(2y+4\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{9}=1",
        // change 16 to 17
        "\\frac{\\left(y+0\\right)^2}{17}-\\frac{\\left(x+2\\right)^2}{9}=1",
        // change x+2 to 3x+7
        "\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(3x+7\\right)^2}{9}=1",
        // change 9 to 11
        "\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{11}=1",
        // change 1 to 5
        "\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{9}=5",
        // change a variable
        "\\frac{\\left(a+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{9}=1",
      ],
    },
    {
      label: "E232686: $target",
      target: "\\left(y-7\\right)^2=60\\left(x-15\\right)",
      eq: [
        "60(x-15)=(y-7)^2",
        "y^2-14y+49=60x-900",
        "y^2-14y-60x+949=0",
        "\\frac{(y-7)^2}{60}=x-15",
        "x=\\frac{(y-7)^2}{60}+15",
      ],
      ne: [
        // change the exponent 2 to 3
        "\\left(y-7\\right)^3=60\\left(x-15\\right)",
        // change y-7 to 2y-8
        "\\left(2y-8\\right)^2=60\\left(x-15\\right)",
        // change 60 to 40
        "\\left(y-7\\right)^2=40\\left(x-15\\right)",
        // change x-15 to 4x-14
        "\\left(y-7\\right)^2=60\\left(4x-14\\right)",
        // add an exponent 2 to (x-15)
        "\\left(y-7\\right)^2=60\\left(x-15\\right)^2",
        // change a variable
        "\\left(a-7\\right)^2=60\\left(x-15\\right)",
      ],
    },
    {
      label: "E234938: $target",
      target: "\\frac{x^2}{64}+\\frac{y^2}{36}=1",
      eq: [
        // the item's alternate correct answer
        "36x^2+64y^2=2,304",
        "\\frac{y^2}{36}+\\frac{x^2}{64}=1",
        "1=\\frac{x^2}{64}+\\frac{y^2}{36}",
        "9x^2+16y^2=576",
        "36x^2+64y^2-2304=0",
        "\\frac{x^2}{64}=1-\\frac{y^2}{36}",
      ],
      ne: [
        // change x^2 to x^4
        "\\frac{x^4}{64}+\\frac{y^2}{36}=1",
        // change 64 to 6
        "\\frac{x^2}{6}+\\frac{y^2}{36}=1",
        // change y^2 to 3y^(-2)
        "\\frac{x^2}{64}+\\frac{3y^{-2}}{36}=1",
        // change 36 to 360
        "\\frac{x^2}{64}+\\frac{y^2}{360}=1",
        // change 1 to 3
        "\\frac{x^2}{64}+\\frac{y^2}{36}=3",
        // all of the above
        "\\frac{x^4}{6}+\\frac{3y^{-2}}{360}=3",
        // change a variable
        "\\frac{x^2}{64}+\\frac{z^2}{36}=1",
      ],
    },
    {
      label: "E234938 alternate: $target",
      target: "36x^2+64y^2=2,304",
      eq: ["\\frac{x^2}{64}+\\frac{y^2}{36}=1", "9x^2+16y^2=576"],
      ne: [
        "36x^4+64y^2=2,304",
        "36x^2+64y^2=2,305",
        "36x^2+64y^{-2}=2,304",
      ],
    },
    {
      label: "E234162: $target",
      target: "\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{900}=1",
      eq: [
        "\\frac{y^2}{900}+\\frac{(x+10)^2}{275}=1",
        "1=\\frac{(x+10)^2}{275}+\\frac{y^2}{900}",
        "900(x+10)^2+275y^2=247500",
        "36(x+10)^2+11y^2=9900",
        "36x^2+720x+3600+11y^2=9900",
      ],
      ne: [
        // change x+10 to 2x+11
        "\\frac{\\left(2x+11\\right)^2}{275}+\\frac{y^2}{900}=1",
        // change 275 to 27.5
        "\\frac{\\left(x+10\\right)^2}{27.5}+\\frac{y^2}{900}=1",
        // change y^2 to 3y^8
        "\\frac{\\left(x+10\\right)^2}{275}+\\frac{3y^8}{900}=1",
        // change 900 to 3
        "\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{3}=1",
        // change 1 to 5
        "\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{900}=5",
        // change a variable
        "\\frac{\\left(x+10\\right)^2}{275}+\\frac{z^2}{900}=1",
      ],
    },
  ],
};
