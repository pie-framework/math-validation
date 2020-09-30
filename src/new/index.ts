import { LatexToAst } from "./latex-to-ast";
import { AstToMathJs } from "./ast-to-mathjs";

import {
  simplify as ms,
  rationalize,
  parse,
  parser,
  MathNode,
  Parser,
} from "mathjs";

const SIMPLIFY_RULES = [
  { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
  { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
  { l: "(n^2)/n", r: "n" },
  { l: "(n^2) + n", r: "n * (n + 1)" },
  { l: "((n^n1) + n)/n", r: "n^(n1-1)+1" },
  { l: "(n^2) + 2n", r: "n * (n + 2)" },
  // perfect square formula:
  // { l: "(n1 + n2) ^ 2", r: "(n1 ^ 2) + 2*n1*n2 + (n2 ^ 2)" },
  // { l: "(n^2) + 4n + 4", r: "(n^2) + (2n * 2) + (2^2)" },
];

const simplify = (v) => {
  const rules = SIMPLIFY_RULES.concat((ms as any).rules);
  // console.log("v:", v);
  // console.log("rules:", rules);
  return ms(v, rules); //.concat(SIMPLIFY_RULES));
};

const lta = new LatexToAst();
const atm = new AstToMathJs();
const toMathNode = (latex: string): MathNode => {
  const ast = lta.convert(latex);

  console.log(latex, "=> ", ast);
  return atm.convert(ast);
};

export type Extra = {
  node: MathNode;
  symbols: string[];
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

export const evaluate = (a: MathNode, b: MathNode) => {
  const pa = mkExtra(a);
  const pb = mkExtra(b);

  console.log("pa", pa);
  console.log("pb", pb);
  if (pa.symbols.join(",") !== pb.symbols.join(",")) {
    return false;
  }

  const prsr = parser();
  pa.symbols.forEach((s) => {
    prsr.set(s, 1);
  });

  const aResult = prsr.evaluate(a.toString());
  const bResult = prsr.evaluate(b.toString());
  return aResult === bResult;
  // return true;
};

export const latexEqual = (a: string, b: string, opts: any) => {
  // console.log("this is the new latexEqual function");

  if (a === b) {
    return true;
  }

  const amo = toMathNode(a);
  // console.log("amo:", amo);
  const bmo = toMathNode(b);
  return isMathEqual(amo, bmo);
};

export const normalize = (a: string | MathNode) => {
  // console.time(`rationalize:${a.toString()}`);

  let r: string | MathNode = a;
  try {
    r = rationalize(a, {}, true).expression;
  } catch (e) {
    // ok;
  }
  // const r = rationalize(a, {}, true);
  // console.log("r:", r.toString());
  // console.timeEnd(`rationalize:${a.toString()}`);
  // console.time(`simplify:${r.toString()}`);
  const s = simplify(r);
  // console.log("s:", s.toString());
  // console.timeEnd(`simplify:${r.toString()}`);
  return s;
};

export const isMathEqual = (a: MathNode, b: MathNode) => {
  // console.log("bmo:", bmo);

  const as = normalize(a);
  const bs = normalize(b);

  // console.log("as:", as);
  // console.log("bs:", bs);

  if (as.equals(bs)) {
    return true;
  }

  // console.warn("FALLING BACK TO EXPRESSION EVALUATION");

  // const result = evaluate(as, bs);

  // if (result) {
  //   return true;
  // }

  return false;

  // const n = parse("(x^2)/2");
  // console.log("n:", n);
  // const sn = simplify(n);
  // console.log("sn:", sn);
  // const sbmo = simplify(bmo);
  // console.log("sbmo", sbmo);
  // const r = me.fromLatex(a).equals(me.fromLatex(b));
  // const am = me.fromLatex(a);
  // const bm = me.fromLatex(b);
  // console.log("am:", am);
  // console.log("bm:", bm, bm.simplify());
  // console.log("r:", r);
  // const at = latexToText(a);
  // const bt = latexToText(b);
  // console.log("at:", at);
  // console.log("bt:", bt);
  // return true;
};
