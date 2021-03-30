import { MathNode } from "mathjs";
import { logger } from "../log";

export type LiteralOpts = {
  allowTrailingZeros?: boolean;
  ignoreOrder?: boolean;

  /** For future implementation, per PD-304
   * If a response matches an "exception", it is incorrect, even if it also matches one of the correct answers
   */
  exception?: boolean;
};

const log = logger("mv:literal");

export const isMathEqual = (a: MathNode, b: MathNode, opts: LiteralOpts) => {
  log("a:", a.toTex(), "b: ", b.toTex());
  return a.equals(b);
};
