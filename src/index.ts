import { i } from "mathjs";
import * as legacy from "./legacy";
import * as n from "./new";
export type Opts = {
  legacy: boolean;
};

export const latexEqual = (a: string, b: string, opts: Opts) => {
  /** port notes:
   * allowDecimals: Its intended purpose was to allow the use of commas as thousands separators, so that 1,000 and 1000 would be treated the same. The decision that has been made is that we want to ALWAYS allow commas as thousands separators, so we don't need that flag
   */
  opts = { legacy: true, ...opts };
  if (opts.legacy) {
    return legacy.default(a, b, { isLatex: true, allowDecimals: true });
  } else {
    console.log("!! => new impl!");
    return n.latexEqual(a, b, opts);
  }
};

// equal is really asking is latex equal
export const equal = latexEqual;

export const latexToText = (input: string): string => {
  return legacy.latexToText(input);
};
