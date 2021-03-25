import { logger } from "../log";
/** works
 * 
import {
  MathNode,
  rationalize,
  json,
  simplify as ms,
  parse,
  parser,
} from "mathjs";
*/
// import { create, all } from "mathjs";
import { mathjs } from "../mathjs";

type MathNode = any;
const log = logger("mv:symbolic");

export type SymbolicOpts = {};

// const mathjs = create(all, { number: "Fraction" });

const { simplify: ms, rationalize, derivative, parse, parser, json } = mathjs;

const SIMPLIFY_RULES = [
  { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
  { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
  { l: "(n^2)/n", r: "n" },
  { l: "(n^2) + n", r: "n * (n + 1)" },
  { l: "((n^n1) + n)/n", r: "n^(n1-1)+1" },
  { l: "(n^2) + 2n", r: "n * (n + 2)" },
  // { l: "(n/n1) * n2", r: "t" },
  // perfect square formula:
  { l: "(n1 + n2) ^ 2", r: "(n1 ^ 2) + 2*n1*n2 + (n2 ^ 2)" },
  // { l: "(n^2) + 4n + 4", r: "(n^2) + (2n * 2) + (2^2)" },
];

const simplify = (v) => {
  const rules = SIMPLIFY_RULES.concat((ms as any).rules);
  return ms(v, rules); //.concat(SIMPLIFY_RULES));
};

const normalize = (a: string | MathNode) => {
  let r: string | MathNode = a;
  try {
    r = rationalize(a, {}, true).expression;
  } catch (e) {
    // ok;
  }
  const s = simplify(r);

  log("[normalize] input: ", a.toString(), "output: ", s.toString());
  return s;
};

export const isMathEqual = (
  a: MathNode,
  b: MathNode,
  opts?: { mode?: "symbolic" | "literal" }
) => {
  const as = normalize(a);
  const bs = normalize(b);

  log("[isMathEqual]", as.toString(), "==?", bs.toString());

  // log(
  //   "je?",
  //   //@ts-ignore
  //   JSON.stringify(as, json, "  ") ===
  //     //@ts-ignore
  //     JSON.stringify(bs, json, "  ")
  // );
  // //@ts-ignore
  // log(
  //   "[isMathEqual]",
  //   //@ts-ignore
  //   JSON.stringify(as, json, "  "),
  //   //@ts-ignore
  //   JSON.stringify(bs, json, "  ")
  // );

  // if (as.equals(bs)) {
  //   return true;
  // }
  // return evaluate(as, bs);
  const firstTest = as.equals(bs);
  if (firstTest) {
    return true;
  }

  /**
   * Note: this seems very dodgy that we have to try a 2nd round of normalization here.
   * Why is this necessary and try and remove it.
   */
  const at = normalize(as);
  const bt = normalize(bs);

  return at.equals(bt);
  // NOTE: A temporary naive fix by checking derivatives

  // log(a.toString(), "==", b.toString(), "?");
  // // log(as.toString());
  // // log(bs.toString());

  // // log("as:", as.toString());
  // // log("bs:", bs.toString());

  // // log("equal? ", as.equals(bs));
  // if (as.equals(bs)) {
  //   return true;
  // }

  // const aSymbols = getSymbols(a);
  // const bSymbols = getSymbols(b);

  // // log("aSymbols:", aSymbols);
  // // log("bSymbols:", bSymbols);

  // if (!arraysEqual(aSymbols, bSymbols)) {
  //   return false;
  // }

  // if (aSymbols.length === 0) {
  //   return false;
  // }

  // const results = aSymbols.map((sym) => {
  //   const ad = derivative(as, sym);
  //   const bd = derivative(bs, sym);

  //   log("as:", as.toString());
  //   log("bs:", bs.toString());

  //   log("sym:", sym);
  //   log("a derivative:", ad, as.toString());
  //   log("b derivative:", bd, bs.toString());

  //   return {
  //     symbol: sym,
  //     equal: ad.equals(bd),
  //   };
  // });

  // const notEqual = results.filter((r) => !r.equal);

  // log("notEqual", notEqual);
  // if (notEqual.length > 0) {
  //   log(notEqual);
  //   return false;
  // } else {
  //   const result = evaluate(as, bs);
  //   log("result:", result);
  //   if (result) {
  //     return true;
  //   }
  //   return false;
  // }
};

const mkExtra = (n: MathNode) => {
  const out = [];
  n.traverse((node, path, parent) => {
    if (node.isSymbolNode && !out.includes(node.name)) {
      out.push(node.name);
    }
  });
  return {
    node: n,
    symbols: out.sort(),
  };
};

const getSymbols = (n: MathNode): string[] => {
  const symbols = [];
  n.traverse((node, path, parent) => {
    if (node.isSymbolNode && !symbols.includes(node.name)) {
      symbols.push(node.name);
    }
  });
  return symbols.sort();
};

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const evaluate = (a: MathNode, b: MathNode) => {
  const pa = mkExtra(a);
  const pb = mkExtra(b);

  log("pa", pa, pa.toString());
  log("pb", pb, pb.toString()) /
    log("symbols:pa", pa.symbols, "pb:", pb.symbols);
  log("o:pa", pa.node.toString(), "pb:", pb.node.toString());
  if (pa.symbols.join(",") !== pb.symbols.join(",")) {
    return false;
  }

  const prsr = parser();
  pa.symbols.forEach((s) => {
    prsr.set(s, 1);
  });

  const aResult = prsr.evaluate(a.toString());
  const bResult = prsr.evaluate(b.toString());

  log("aResult:", aResult, typeof aResult);
  log("bResult:", bResult, typeof bResult);

  if (typeof aResult !== typeof bResult) {
    return false;
  }

  return parse(aResult.toString()).equals(parse(bResult.toString()));
  // return aResult.equals(bResult);
  // return true;
};
