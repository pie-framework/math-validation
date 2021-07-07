import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import { logger } from "../log";
import { sort } from "../node-sort";

const { simplify } = mathjs;

export type LiteralOpts = {
  allowTrailingZeros?: boolean;
  ignoreOrder?: boolean;

  /** For future implementation, per PD-304
   * If a response matches an "exception", it is incorrect, even if it also matches one of the correct answers
   */
  exception?: string[];
};

const log = logger("mv:literal");

const simplifyRule = { l: "tzn(n1, n2)", r: "n1" };

export const isMathEqual = (a: MathNode, b: MathNode, opts: LiteralOpts) => {
  if (opts && opts.allowTrailingZeros) {
    a = simplify(a, [simplifyRule]);
    b = simplify(b, [simplifyRule]);
  }

  if (opts && opts.ignoreOrder) {
    a = sort(a);

    b = sort(b);
  }

  let equalTex;

  // @ts-ignore
  if (!a.isUnit) {
    equalTex = a.toTex().trim() === b.toTex().trim();
  }

  return a.equals(b) || equalTex;
};
