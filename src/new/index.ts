import { LatexToAst } from "./latex-to-ast";
import { AstToMathJs } from "./ast-to-mathjs";

import {
  simplify as ms,
  rationalize,
  derivative,
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
  // { l: "(n/n1) * n2", r: "t" },
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

  // console.log(latex, "=> ", JSON.stringify(ast));
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

  // console.log("a:", a.toString());
  // console.log(
  //   a,
  //   " - derivative ->",
  //   derivative(a, "x").toString(),
  //   derivative(a, "x")
  // );
  let r: string | MathNode = a;
  // try {
  r = rationalize(a, {}, true).expression;
  // } catch (e) {
  // ok;
  // }
  // const r = rationalize(a, {}, true);
  // console.log("r:", r.toString());
  // console.timeEnd(`rationalize:${a.toString()}`);
  // console.time(`simplify:${r.toString()}`);
  const s = simplify(r);
  // console.log("s:", s.toString());
  // console.timeEnd(`simplify:${r.toString()}`);
  return s;
};

export const getSymbols = (n: MathNode): string[] => {
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

export const isMathEqual = (a: MathNode, b: MathNode) => {
  // console.log("bmo:", bmo);

  // NOTE: A temporary naive fix by checking derivatives

  const as = normalize(a);
  const bs = normalize(b);

  console.log("as:", as, as.toString());
  console.log("bs:", bs, bs.toString());

  console.log("equal? ", as.equals(bs));
  if (as.equals(bs)) {
    return true;
  }

  const aSymbols = getSymbols(a);
  const bSymbols = getSymbols(b);

  console.log("aSymbols:", aSymbols);
  console.log("bSymbols:", bSymbols);

  if (!arraysEqual(aSymbols, bSymbols)) {
    return false;
  }

  if (aSymbols.length === 0) {
    return false;
  }

  const results = aSymbols.map((sym) => {
    const ad = derivative(a, sym);
    const bd = derivative(b, sym);

    // console.log("sym:", sym);
    // console.log(ad.toString());
    // console.log(bd.toString());

    return {
      symbol: sym,
      equal: ad.equals(bd),
    };
  });

  const notEqual = results.filter((r) => !r.equal);

  if (notEqual.length > 0) {
    console.log(notEqual);
    return false;
  } else {
    return true;
  }

  // const ad = derivative(a, "x");
  // const bd = derivative(b, "x");

  // if (ad.equals(bd)) {
  //   return true;
  // }
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
