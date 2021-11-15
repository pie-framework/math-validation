import { logger } from "../log";
import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import { sort } from "../node-sort";
import { compareEquations } from "./compare-equations";
import { compareCompoundInequations } from "./compare-compound-inequations";

const m: any = mathjs;
const log = logger("mv:symbolic");
const positiveInfinity = 1.497258191621251e6;
const negativeInfinity = -1.497258191621251e6;

export type SymbolicOpts = {};

const { simplify: ms, rationalize } = mathjs;

const SIMPLIFY_RULES = [
  { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
  { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
  { l: "(v1-v2)/n", r: "v1/n-v2/n" },
  { l: "(v1-n)/n", r: "v1/n-1" },
  { l: "n/n1-c1", r: "(n-c1*n1)/n1" },
  { l: "i^2", r: "-1" },
  { l: "pi", r: "3.141592653589793" },
  { l: "n/(n*n1)", r: "1/n1" },
  { l: "c1/(c2*(n3))", r: "(c1/c2)*(1/n3)" },
  { l: "n1/(n(n+1)+1(n+1))", r: "n1/((n+1)^2)" },

  // perfect square formula
  { l: "(n1 + n2) ^ 2", r: "(n1 ^ 2) + 2*n1*n2 + (n2 ^ 2)" },

  { l: "tzn(n1, n2)", r: "n1" },
  { l: "n1/(-n2)", r: "-(n1/n2)" },
  { l: "sin(n*pi)", r: "0" },

  // trigonometry: defining relations for tangent, cotangent, secant, and cosecant in terms of sine and cosine
  { l: "sin(n)/cos(n)", r: "tan(n)" },
  { l: "csc(n)", r: "1/sin(n)" },
  { l: "sec(n)", r: "1/cos(n)" },
  { l: "cot(n)", r: "1/tan(n)", r1: "cos(n)/sin(n)" },
  { l: "1/tan(n)", r: "cos(n)/sin(n)" },

  // TO DO: the Pythagorean formula for sines and cosines.

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

export const simplify = (v) => {
  const rules = SIMPLIFY_RULES.concat((ms as any).rules);
  return ms(v, rules); //.concat(SIMPLIFY_RULES));
};

const normalize = (a: string | MathNode | any) => {
  let r: string | MathNode | any = a;
  let onlyConstant = true;
  let containsFunctionNode = false;
  let containsArrayNode = false;
  let pi = false;
  let containsInverseFlag = false;

  r.traverse(function (node, path, parent) {
    if (node.isArrayNode) {
      containsArrayNode = true;
      node.items = node.items.map((item) => simplify(item));
    }

    if (node.isSymbolNode) {
      pi = pi || node.name === "pi";
      containsInverseFlag = containsInverseFlag || node.name === "f^{-1}";
    }
  });

  if (r.args) {
    r.args = r.args.map((arg) => {
      if (
        !arg.isFunctionNode &&
        !arg.isArrayNode &&
        !containsInverseFlag &&
        !pi
      ) {
        try {
          arg = simplify(arg);
        } catch (e) {
          // ok;
        }
      }

      containsFunctionNode = containsFunctionNode || arg.isFunctionNode;

      onlyConstant = onlyConstant && !!arg.isConstantNode;

      return arg;
    });

    if (containsFunctionNode || containsInverseFlag) {
      r.args = r.args.map((arg) => {
        if (!arg.isFunctionNode && !arg.isArrayNode) {
          try {
            arg = rationalize(simplify(arg), {}, true).expression;
          } catch (e) {
            // ok;
          }
        }

        return arg;
      });
    }
  }

  if (r.fn !== "equal") {
    try {
      onlyConstant = false;
      r = rationalize(r, {}, true).expression;
    } catch {}
  }

  if (r.conditionals && r.params) {
    r.params = r.params.map((param) => sort(simplify(param)));
  }

  if (!containsArrayNode && !onlyConstant) {
    // overcome TypeError
    try {
      r = simplify(r);
    } catch (e) {}
  }

  log("[normalize] input: ", a.toString(), "output: ", r.toString());

  // check for infinity
  if (
    r.toString() === "Infinity" ||
    +r.toString() >= positiveInfinity ||
    +r.toString() <= negativeInfinity
  ) {
    r = new m.SymbolNode("Infinity");
  }

  if (r.value) {
    r.value = new m.Fraction(Math.round(r.value * 10000) / 10000);
  } else if (r.fn === "unaryMinus") {
    r.args[0].value = new m.Fraction(
      Math.round(r.args[0].value * 10000) / 10000
    );
    r = simplify(r);
  }

  return r;
};

export const isMathEqual = (a: any, b: any) => {
  let as: MathNode;
  let bs: MathNode;

  // apply sort if we are not in a relationalNode

  as = a.conditionals ? normalize(a) : sort(normalize(a));

  bs = b.conditionals ? normalize(b) : sort(normalize(b));

  log("[isMathEqual]", as.toString(), "==?", bs.toString());

  const isSortingEnough = sort(a).equals(sort(b));
  const isTexEnough = as.toTex().trim() === bs.toTex().trim();

  let equality = isTexEnough || as.equals(bs) || isSortingEnough;

  if (equality) {
    return true;
  }

  // if both expressions are equations
  if (as.fn === "equal" && bs.fn === "equal") {
    return compareEquations(as, bs, false);
  }

  // if both expressions are inequalities treat greater sign as equal sign
  if (
    (as.fn === "larger" && bs.fn === "larger") ||
    (as.fn === "largerEq" && bs.fn === "largerEq")
  ) {
    // solving a 2 way inequality is the same as solving an equation, we can treat the greater sign as an equal sign
    // the difference is that solution should be plotted on a number line (or interval)
    // if we have the same signs and the same direction, the interval will always be the same, starting with the solution
    as.fn = "equal";
    bs.fn = "equal";
    as.op = "=";
    bs.op = "=";

    return compareEquations(as, bs, true);
  }

  // check for compound inequalities/3-way inequalities
  if (
    //@ts-ignore
    as?.conditionals?.length === bs?.conditionals?.length &&
    //@ts-ignore
    as?.conditionals?.length === 2 &&
    //@ts-ignore
    as?.conditionals?.toString() === bs?.conditionals?.toString()
  ) {
    const params = [
      "smaller",
      "smallerEq",
      "larger",
      "largerEq",
      "equal",
      "unequal",
    ];

    const paramsIncludedA = params.some((param) =>
      //@ts-ignore
      as.conditionals.includes(param)
    );

    const paramsIncludedB = params.some((param) =>
      //@ts-ignore
      bs.conditionals.includes(param)
    );

    if (paramsIncludedA && paramsIncludedB) {
      return compareCompoundInequations(as, bs);
    }
  }

  return equality;
};
