import * as legacy from "@pie-lib/math-evaluator";

export type Opts = {
  foo: boolean;
};

export const equal = (a: string, b: string, opts: Opts): boolean => {
  return legacy.default(a, b, { isLatex: true });
};

export const latexToText = (input: string): string => {
  return legacy.latexToText(input);
};
