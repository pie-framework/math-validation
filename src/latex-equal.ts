import { LatexToAst } from "./conversion/latex-to-ast";
import { AstToMathJs } from "./conversion/ast-to-mathjs";
import { isMathEqual as isSymbolicEqual, SymbolicOpts } from "./symbolic";
import { isMathEqual as isLiteralEqual, LiteralOpts } from "./literal";
import { differenceIsTooGreat } from "./difference";

export type Latex = string;
export type RawAst = any[];

export type Opts = {
  mode?: "symbolic" | "literal";
  literal?: LiteralOpts;
  symbolic?: SymbolicOpts;

  /**
   *  this is to be removed - no point adding it: https://illuminate.atlassian.net/browse/PD-1031
   * allowThousandsSeparator?: boolean;
   */
  /** only for development - to be removed */
  legacy?: boolean;
};

const lta = new LatexToAst();
const atm = new AstToMathJs();

export const latexEqual = (a: Latex, b: Latex, opts: Opts) => {
  if (!a || !b) {
    return false;
  }

  if (a === b) {
    return true;
  }

  const al = lta.convert(a);

  const bl = lta.convert(b);

  if (differenceIsTooGreat(al, bl)) {
    return false;
  }

  const amo = atm.convert(al);

  const bmo = atm.convert(bl);

  if (opts.mode === "literal") {
    return isLiteralEqual(amo, bmo, opts.literal);
  } else {
    return isSymbolicEqual(amo, bmo, opts.symbolic);
  }
};
