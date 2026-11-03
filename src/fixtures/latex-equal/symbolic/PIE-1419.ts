// two-variable inequalities must describe the same region, not just agree at x = 1
export default {
  mode: "symbolic",
  tests: [
    {
      label: "$target",
      target: "y>2x+1",
      eq: [
        "y-2x>1",
        "y-2x-1>0",
        "2y>4x+2",
        "2x+1<y",
        "-y<-2x-1",
        "-y+2x+1<0",
      ],
      ne: [
        // same boundary value at x = 1, different slope
        "y>3x",
        "y>x+2",
        // same line, opposite side
        "y<2x+1",
        "y\\ge2x+1",
        "-y>-2x-1",
      ],
    },
    {
      label: "$target",
      target: "3x-2y\\ge6",
      eq: ["3x-6\\ge2y", "-3x+2y\\le-6", "6x-4y\\ge12", "2y\\le3x-6"],
      ne: ["3x-2y\\ge5", "2x-3y\\ge6", "3x-2y\\le6", "3x+2y\\ge6"],
    },
    {
      // not linear in y, so the x = 1 check could not solve it
      label: "$target",
      target: "x^2+y^2\\le4",
      eq: ["4\\ge x^2+y^2", "2x^2+2y^2\\le8", "x^2+y^2-4\\le0"],
      ne: ["x^2+y^2\\le5", "x^2+2y^2\\le4", "x^2+y^2\\ge4"],
    },
    {
      label: "$target",
      target: "y^2>x",
      eq: ["2y^2>2x", "x<y^2", "y^2-x>0"],
      ne: ["y^2>2x", "y^3>x", "y^2<x"],
    },
    {
      // these only describe the same region where x or y is positive
      label: "$target",
      target: "y>x",
      eq: ["y-x>0", "2y>2x", "x<y"],
      ne: [
        "\\frac{y}{x}>1",
        "\\frac{1}{y}<\\frac{1}{x}",
        "y\\cdot y>x\\cdot y",
        "(y-x)x>0",
      ],
    },
    {
      label: "$target",
      target: "xy>1",
      ne: ["y>\\frac{1}{x}"],
    },
    {
      // with the function in the target, the numeric check decides
      label: "$target",
      target: "y>\\left|x\\right|",
      ne: ["y>x", "y>-x"],
    },
  ],
};
