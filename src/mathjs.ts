import { all, create, MathNode } from "mathjs";
export { MathNode };
export const mathjs = create(all, { number: "Fraction" });

export const replacer = mathjs.replacer;
