import { MathNode } from "mathjs";
import { logger } from "../log";
const { create, all } = require("mathjs");

const mathjs = create(all);

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
  if(typeof a === "string") {
    a = mathjs.parse(a);
  }

  if(typeof b === "string") {
    b = mathjs.parse(b);
  }

  if (opts && opts.allowTrailingZeros) {
    a = mathjs.simplify(a, [simplifyRule]);
    b = mathjs.simplify(b, [simplifyRule]);
  }

  log("a:", a.toTex(), "b: ", b.toTex());

  const equalTex = a.toTex().trim() === b.toTex().trim();

  return a.equals(b) || equalTex;
};
