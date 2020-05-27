import * as legacy from "@pie-lib/math-evaluator";

export type Opts = {
  foo: boolean;
};

export const equal = (a: string, b: string, opts: Opts): boolean => {
  /** port notes:
   * allowDecimals: Its intended purpose was to allow the use of commas as thousands separators, so that 1,000 and 1000 would be treated the same. The decision that has been made is that we want to ALWAYS allow commas as thousands separators, so we don't need that flag
   */
  return legacy.default(a, b, { isLatex: true, allowDecimals: true });
};

export const latexToText = (input: string): string => {
  return legacy.latexToText(input);
};
