import { Latex } from ".";
import debug from "debug";
import { LatexToAst } from "./conversion/latex-to-ast";
import { RawAst } from "./latex-equal";

const log = debug("difference");

export const differenceIsTooGreat = (a: RawAst, b: RawAst) => {
  // remove spaces, trailing zeros & left & right parenthesis before counting length
  // const STRIP_LR = /(\\left\()|(\\right\))|( )|([.](0+))/g;
  // const aLength = a.replace(STRIP_LR, "").length;
  // const bLength = b.replace(STRIP_LR, "").length;

  // const lta = new LatexToAst();
  // const al = lta.convert(a);
  // const bl = lta.convert(b);

  // log("al", al.toString());
  // log("bl", bl.toString());
  const smallest = Math.min(a.toString().length, b.toString().length);
  const biggest = Math.max(a.toString().length, b.toString().length);
  const limit = (1 / smallest) * 100 + 10;
  const diff = biggest - smallest;

  log("a:", a.toString(), "b:", b.toString(), "limit:", limit, "diff:", diff);

  if (diff > limit) {
    return true;
  } else {
    return false;
  }
};
