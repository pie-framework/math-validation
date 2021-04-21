import { Triage } from "../triage";

export default {
  mode: "literal",
  skip: true,
  tests: [
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "a+b",
    //   eq: ["b+a"],
    //   triage: Triage.NODE_SORT,
    // },
    // {
    //   opts: {
    //     ignoreOrder: false,
    //   },
    //   target: "a+b",
    //   ne: ["b+a"],
    // },
    // {
    //   // treat reordered addends as identical
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "a+b+10",
    //   eq: ["a+10+b", "10+a+b", "10+b+a", "b+a+10", "b+a+10"],
    //   triage: Triage.NODE_SORT,
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "a+b+10",
    //   ne: ["a+10+b", "10+a+b", "10+b+a", "b+a+10", "b+a+10"],
    // },
    // {
    //   // treat reordered multiplicands as identical
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "a*b*c",
    //   eq: ["a×c×b", "b·a·c", " b×c·a", "c·b×a", "c×a×b"],
    //   triage: [Triage.NODE_SORT, Triage.LATEX_PARSE_ERROR],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "a×b×c",
    //   ne: ["a×c×b", "b·a·c", " b×c·a", "c·b×a", "c×a×b"],
    //   triage: Triage.LATEX_PARSE_ERROR,
    // },
    // // allow the sides of an equation to be swapped
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "y = 7x =z",
    //   eq: ["7x=y=z"],
    //   triage: Triage.NODE_SORT,
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "y = 7x =z",
    //   ne: ["7x=y=z"],
    //   triage: Triage.NODE_SORT,
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "y = 7x",
    //   eq: ["7x=y"],
    //   triage: Triage.NODE_SORT,
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "y = 7x",
    //   ne: ["7x=y"],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "y = 3x+4",
    //   eq: ["y=4+3x", "3x+4=y", "4+3x=y"],
    //   triage: Triage.NODE_SORT,
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "y = 3x+4",
    //   ne: ["y=4+3x", "3x+4=y", "4+3x=y"],
    // },
    // {
    //   // allow the order of an inequality to be reversed, provided the signs of the operators are reversed
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "0<x≤4",
    //   eq: ["4≥x>0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "0<x≤4",
    //   ne: ["4≥x>0"],
    //   triage: Triage.LATEX_PARSE_ERROR,
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "0+2<x",
    //   eq: ["x>2+0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "0+2<x",
    //   ne: ["x>2+0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "0<2<x",
    //   eq: ["x>2>0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "0<2<x",
    //   ne: ["x>2>0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "0≤x",
    //   eq: ["x≥0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    {
      opts: {
        literal: { ignoreOrder: true },
      },
      target: "A < B > C",
      eq: ["A <B >C", "C<B>A"],
      triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    },
    // {
    //   opts: {
    //     literal: { ignoreOrder: true },
    //   },
    //   target: "a+b+c = b+c+a = a+b+c",
    //   eq: ["a+b+c = a+b+c = a+b+c"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
    // {
    //   opts: {
    //     literal: { ignoreOrder: false },
    //   },
    //   target: "0≤x",
    //   ne: ["x≥0"],
    //   triage: [Triage.LATEX_PARSE_ERROR, Triage.NODE_SORT],
    // },
  ],
};
