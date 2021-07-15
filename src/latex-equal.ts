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
  console.time("latexEqual");
  if (!a || !b) {
    return false;
  }

  if (a === b) {
    return true;
  }

  console.time("convert:lta:a");
  const al = lta.convert(a);
  console.timeEnd("convert:lta:a");

  console.time("convert:lta:b");
  const bl = lta.convert(b);
  console.timeEnd("convert:lta:b");

  if (differenceIsTooGreat(al, bl)) {
    return false;
  }

  console.time("conversion:ast-to-mathjs:a");
  const amo = atm.convert(al);
  console.timeEnd("conversion:ast-to-mathjs:a");

  console.time("conversion:ast-to-mathjs:b");
  const bmo = atm.convert(bl);
  console.timeEnd("conversion:ast-to-mathjs:b");

  if (opts.mode === "literal") {
    return isLiteralEqual(amo, bmo, opts.literal);
  } else {
    const out = isSymbolicEqual(amo, bmo, opts.symbolic);
    console.timeEnd("latexEqual");
    return out;
  }
};
