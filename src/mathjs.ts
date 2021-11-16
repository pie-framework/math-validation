import { all, create } from "mathjs";
export const mathjs = create(all, { number: "Fraction" });
export const { parse } = mathjs;

// @ts-ignore
export const replacer = mathjs.replacer;
