import { LatexToAst } from "./latex-to-ast";
import { AstToMathJs } from "./ast-to-mathjs";
import { MathNode } from "mathjs";
import { isMathEqual } from "./math-equal";

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
  return isMathEqual(amo, bmo);
};
