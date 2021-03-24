import { MathNode } from "mathjs";
import { logger } from "../log";

const log = logger("mv:literal");
export const isMathEqual = (a: MathNode, b: MathNode) => {
  log("a:", a.toTex(), "b: ", b.toTex());
  return a.equals(b);
};
