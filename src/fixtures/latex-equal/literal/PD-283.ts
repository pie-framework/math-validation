export default {
  mode: "literal",
  tests: [
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "a+b",
      eq: ["b+a"],
    },
    {
      opts: {
        ignoreOrder: false,
      },
      target: "a+b",
      ne: ["b+a"],
    },
    {
      // treat reordered addends as identical
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "a+b+10",
      eq: ["a+10+b", "10+a+b", "10+b+a", "b+a+10", "b+a+10"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "a+b+10",
      ne: ["a+10+b", "10+a+b", "10+b+a", "b+a+10", "b+a+10"],
    },
    {
      // treat reordered multiplicands as identical
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "a*b*c",
      eq: ["a×c×b", "b·a·c", " b×c·a", "c·b×a", "c×a×b"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "a×b×c",
      ne: ["a×c×b", "b·a·c", " b×c·a", "c·b×a", "c×a×b"],
    },
    // allow the sides of an equation to be swapped
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "y = 7x =z",
      eq: ["7x=y=z"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "y = 7x =z",
      ne: ["7x=y=z"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "y = 7x",
      eq: ["7x=y"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "y = 7x",
      ne: ["7x=y"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "y = 3x+4",
      eq: ["y=4+3x", "3x+4=y", "4+3x=y"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "y = 3x+4",
      eq: ["y=(4+3x)", "3x+4=y", "4+3x=y"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "y = 3x+4",
      eq: ["y=(4+3x)", "3x+4=y", "4+3x=y"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "a + b + c + d +e + f + 2 *x",
      eq: ["(a+c) + (b+e) + 2*x +d+ f", "(a+b+c)+(2*x+f+((e))+d)"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "3y",
      eq: ["(3)(y)", "(y)(3)", "3(y)", "(3)y", "((((3))))y"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "y = 3x+4",
      ne: ["y=4+3x", "3x+4=y", "4+3x=y"],
    },
    {
      // allow the order of an inequality to be reversed, provided the signs of the operators are reversed
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "4≥x>0",
      eq: [" 0<x≤4"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "0<x≤4",
      ne: ["4≥x>0"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "0+2<x",
      eq: ["x>2+0"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "0+2<x",
      ne: ["x>2+0"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "0<2<x",
      eq: ["x>2>0"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "0<2<x",
      ne: ["x>2>0"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "0≤x",
      eq: ["x≥0"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "rt≥x",
      eq: ["x≤rt"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "A < B > C",
      eq: ["A <B >C", "C<B>A"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "A+2 < B+5 > C+6",
      eq: ["A+2 <B+5 >C+6", "C+6<B+5>A+2"],
    },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "a+b+c = b+c+a = a+b+c",
      eq: ["a+b+c = a+b+c = a+b+c"],
    },
    {
      opts: {
        literal: { ignoreOrder: false },
      },
      target: "0≤x",
      ne: ["x≥0"],
    },
  ],
};
