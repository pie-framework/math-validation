import { logger } from "../log";
import { mathjs } from "../mathjs";
import { MathNode, ResultSetDependencies } from "mathjs";
import { s as st } from "../node-sort";

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
  { l: "tzn(n1, n2)", r: "n1" },
  { l: "n1/(-n2)", r: "-(n1/n2)" },
];

const simplify = (v) => {
  const rules = SIMPLIFY_RULES.concat((ms as any).rules);
  return ms(v, rules); //.concat(SIMPLIFY_RULES));
};

const normalize = (a: string | MathNode | any) => {
  let r: string | MathNode | any = a;
  try {
    r = rationalize(a, {}, true).expression;
  } catch (e) {
    // ok;
    console.log(e, "failed to rationalize");
  }

  let s = r;

  // for relationalNode apply sort & simplify for all params
  if (r.conditionals && r.params) {
    s.params = r.params.map((param) => st(simplify(param)));
  } else {
    s = simplify(r);
  }

  log("[normalize] input: ", a.toString(), "output: ", s.toString());
  return s;
};

export const isMathEqual = (a: any, b: any, opts?: SymbolicOpts) => {
  let as: MathNode;
  let bs: MathNode;
  console.log(a, "node before proccesing");

  // apply sort if we are not in a relationalNode
  if (!a.conditionals) {
    as = st(normalize(a));
    console.log("as", JSON.stringify(as));
  } else {
    as = normalize(a);
  }

  if (!b.conditionals) {
    bs = st(normalize(b));
    console.log("bs", JSON.stringify(bs));
  } else {
    bs = normalize(b);
  }

  console.log(as, "node after-----------");

  log("[isMathEqual]", as.toString(), "==?", bs.toString());

  //console.log(as.args[0], " as after transform args[0]");
  console.log(bs, " bs after transform");

  return as.equals(bs);
};
