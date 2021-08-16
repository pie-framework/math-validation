import { latexEqual as le } from "./latex-equal";
export type Latex = string;

export type Opts = {
  mode?: "symbolic" | "literal";
};

export const latexEqual = (a: Latex, b: Latex, opts: Opts): boolean => {
  return le(a, b, opts);
};
