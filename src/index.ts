import {
  symbolicEquals as legacySymbolic,
  literalEquals as legacyLiteral,
} from "./legacy";
import { latexEqual as le } from "./latex-equal";
export type Latex = string;

//

let form: HTMLFormElement;
if (typeof document !== "undefined") {
  form = <HTMLFormElement>document.getElementById("#equalityform")!;
}

// @ts-ignore
if (form) {
  // @ts-ignore
  form.onsubmit = () => {
    const formData = new FormData(form);

    const text = formData.get("me1") as string;

    console.log(formData, "formdata")
    console.log(text, "text");
    const validationType = (<HTMLInputElement>(
      document.getElementById("#validation-type")
    )).select();

    let firstExpression: string = (
      document.getElementById("#me1") as HTMLInputElement
    ).value;

    let secondExpression: string = (
      document.getElementById("#me1") as HTMLInputElement
    ).value;

    le(firstExpression, secondExpression, {});
    console.log("input value", validationType);
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
