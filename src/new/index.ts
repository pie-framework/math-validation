import { latexToText } from "./latex";
import me from "@pie-framework/math-expressions";
export const latexEqual = (a: string, b: string, opts: any) => {
  console.log("this is the new latexEqual function");

  if (a === b) {
    return true;
  }

  const r = me.fromLatex(a).equals(me.fromLatex(b));
  console.log("r:", r);
  const at = latexToText(a);
  const bt = latexToText(b);
  console.log("at:", at);
  console.log("bt:", bt);
  return true;
};
