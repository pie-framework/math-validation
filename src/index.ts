import {
  symbolicEquals as legacySymbolic,
  literalEquals as legacyLiteral,
} from "./legacy";
import { latexEqual as le } from "./latex-equal";
export type Latex = string;

//

let form: HTMLFormElement;
if (typeof document !== undefined) {
  form = <HTMLFormElement>document.getElementById("#equalityForm");
}

// @ts-ignore
if (form !== undefined) {
  // @ts-ignore
  form.onsubmit = () => {
    debugger;
    const inputValue = (<HTMLInputElement>(
      document.getElementById("#validation-type")
    )).select();

    console.log("input value", inputValue);
    return false; // prevent reload
  };
}

export type Opts = {
  mode?: "symbolic" | "literal";
  /** only for development - to be removed */
  legacy?: boolean;
};

/**
 * For dev purposes allow legacy to be called for comparison.
 * Eventually we'll remove this.
 */
export const latexEqual = (a: Latex, b: Latex, opts: Opts): boolean => {
  if (opts.legacy) {
    return opts.mode === "literal"
      ? legacyLiteral(a, b, { ...opts, isLatex: true })
      : legacySymbolic(a, b, { ...opts, isLatex: true });
  } else {
    return le(a, b, opts);
  }
};
