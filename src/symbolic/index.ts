import { logger } from "../log";
import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";

const log = logger("mv:symbolic");

export type SymbolicOpts = {};

const { simplify: ms, rationalize } = mathjs;

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

export const isMathEqual = (a: MathNode, b: MathNode, opts?: SymbolicOpts) => {
  const as = normalize(a);
  const bs = normalize(b);

  log("[isMathEqual]", as.toString(), "==?", bs.toString());

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
};
