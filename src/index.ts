import legacyEquals from "./legacy";
import { latexEqual as le } from "./latex-equal";
export type Latex = string;

export type Opts = {
  mode?: "symbolic" | "literal";
  allowThousandsSeparator?: boolean;
  /** only for development - to be removed */
  legacy?: boolean;
};

/**
 * For dev purposes allow legacy to be called for comparison.
 * Eventually we'll remove this.
 */
export const latexEqual = (
  a: Latex,
  b: Latex,
  opts: Opts
): Promise<boolean> => {
  if (opts.legacy) {
    return new Promise((resolve, reject) => {
      try {
        resolve(legacyEquals(a, b, { ...opts, isLatex: true }));
      } catch (e) {
        reject(e);
      }
    });
  } else {
    return Promise.resolve(le(a, b, opts));
  }
};
