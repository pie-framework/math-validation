import { all, create, complex } from "mathjs";
export const mathjs = create(all, { number: "Fraction" });
export const equals= complex
export const { parse } = mathjs;

// @ts-ignore
export const replacer = mathjs.replacer;
