import { MathNode } from "mathjs";
import { logger } from "../log";

export type LiteralOpts = {
  allowTrailingZeros?: boolean;
  ignoreOrder?: boolean;
  allowSpaces?: boolean;
};

const log = logger("mv:literal");

export const isMathEqual = (a: MathNode, b: MathNode, opts: LiteralOpts) => {
  log("a:", a.toTex(), "b: ", b.toTex());
  return a.equals(b);
};
