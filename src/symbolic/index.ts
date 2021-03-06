import { logger } from "../log";
import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import { sort } from "../node-sort";

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
  { l: "(v1-v2)/n", r: "v1/n-v2/n" },
  // { l: "(n/n1) * n2", r: "t" },

  // perfect square formula:
  { l: "(n1 + n2) ^ 2", r: "(n1 ^ 2) + 2*n1*n2 + (n2 ^ 2)" },
  // { l: "(n^2) + 4n + 4", r: "(n^2) + (2n * 2) + (2^2)" },
  { l: "tzn(n1, n2)", r: "n1" },
  { l: "n1/(-n2)", r: "-(n1/n2)" },

  // trigonometry: alternate forms for cotangent, secant and cosecant
  { l: "csc(n)", r: "1/sin(n)" },
  { l: "sec(n)", r: "1/cos(n)" },
  { l: "cot(n)", r: "1/tan(n)" },

  // inverse trigonometric functions relations
  { l: "n1 == asin(n)", r: "n == sin(n1)" },
  { l: "n1 == acos(n)", r: "n == cos(n1)" },
  { l: "n1 == atan(n)", r: "n == tan(n1)" },
  { l: "n1 == acot(n)", r: "n == cot(n1)" },
  { l: "n1 == asec(n)", r: "n == sec(n1)" },
  { l: "n1 == acsc(n)", r: "n == csc(n1)" },

  // relationships between trigonometric functions and inverse trigonometric functions
  { l: "sin(asin(n))", r: "n" },
  { l: "cos(acos(n))", r: "n" },
  { l: "tan(atan(n))", r: "n" },
  { l: "sin(acsc(n))", r: "1/n" },
  { l: "cos(asec(n))", r: "1/n" },
  { l: "tan(acot(n))", r: "1/n" },
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
    //console.log(e, "failed to rationalize");
  }

  if (r.fn === "equal") {
    r.args = r.args.map((arg) => {
      if (!arg.isFunctionNode) {
        try {
          arg = rationalize(arg, {}, true).expression;
        } catch (e) {
          // ok;
        }
      }

      return arg;
    });
  }

  // for relationalNode apply sort & simplify for all params
  if (r.conditionals && r.params) {
    r.params = r.params.map((param) => sort(simplify(param)));
  } else {
    r = simplify(r);
  }

  log("[normalize] input: ", a.toString(), "output: ", r.toString());
  return r;
};

export const isMathEqual = (a: any, b: any, opts?: SymbolicOpts) => {
  let as: MathNode;
  let bs: MathNode;

  // apply sort if we are not in a relationalNode
  as = a.conditionals ? normalize(a) : sort(normalize(a));

  bs = b.conditionals ? normalize(b) : sort(normalize(b));
  log("[isMathEqual]", as.toString(), "==?", bs.toString());

  const isSortingEnough = sort(a).equals(sort(b));
  const equality = as.equals(bs) || isSortingEnough;

  return equality;
};
