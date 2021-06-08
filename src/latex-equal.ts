import { LatexToAst } from "./conversion/latex-to-ast";
import { AstToMathJs } from "./conversion/ast-to-mathjs";
import { MathNode } from "mathjs";
import { isMathEqual as isSymbolicEqual, SymbolicOpts } from "./symbolic";
import { isMathEqual as isLiteralEqual, LiteralOpts } from "./literal";

export type Latex = string;

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

const toMathNode = (latex: string): MathNode => {
  const ast = lta.convert(latex);
  console.log(ast, "ast");
  const converted = atm.convert(ast);
  return converted;
  // return parse(latex);
};

export const latexEqual = (a: Latex, b: Latex, opts: Opts) => {
  if (!a || !b) {
    return false;
  }

  if (a === b) {
    return true;
  }

  /**
   * TODO: apply a cutoff in difference in string size:
   * say correctResponse is 1+1=2
   * but user enters: 'arstasr arsoinerst9arsta8rstarsiotenarstoiarestaoristnarstoi'
   * This string is way bigger than it needs to be.
   * Say limit to 3 times the size of correct string?
   */

  // remove spaces, trailing zeros & left & right parenthesis before counting length
  const aTrimmed = a.replace(
    /(\\left\()|(\\right\))|( )|([.](0+))/g,
    ""
  ).length;

  const bTrimmed = b.replace(
    /(\\left\()|(\\right\))|( )|([.](0+))/g,
    ""
  ).length;

  // here we still have a problem when we have expressions like this: target: "x", expression: "((x^2 + x) / x) - 1"

  // if (aTrimmed > bTrimmed * 6 || bTrimmed > aTrimmed * 6) {
  //   return false;
  // }

  const amo = toMathNode(a);
  const bmo = toMathNode(b);
  if (opts.mode === "literal") {
    return isLiteralEqual(amo, bmo, opts.literal);
  } else {
    return isSymbolicEqual(amo, bmo, opts.symbolic);
  }
};
