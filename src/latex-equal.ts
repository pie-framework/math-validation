import { LatexToAst } from "./conversion/latex-to-ast";
import { AstToMathJs } from "./conversion/ast-to-mathjs";
import { MathNode } from "mathjs";
import { isMathEqual } from "./symbolic/math-equal";

export type Latex = string;

export type Opts = {
  mode?: "symbolic" | "literal";
  allowThousandsSeparator?: boolean;
  /** only for development - to be removed */
  legacy?: boolean;
};

const lta = new LatexToAst();
const atm = new AstToMathJs();

const toMathNode = (latex: string): MathNode => {
  const ast = lta.convert(latex);
  return atm.convert(ast);
};

export const latexEqual = (a: Latex, b: Latex, opts: Opts) => {
  if (a === b) {
    return true;
  }

  const amo = toMathNode(a);
  const bmo = toMathNode(b);
  if (opts.mode === "symbolic") {
    return isMathEqual(amo, bmo);
  } else {
    throw new Error("not ready yet");
  }
};
