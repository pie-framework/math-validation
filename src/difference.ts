import debug from "debug";
import { RawAst } from "./latex-equal";

const log = debug("difference");

export const differenceIsTooGreat = (a: RawAst, b: RawAst) => {
  const smallest = Math.min(a.toString().length, b.toString().length);
  const biggest = Math.max(a.toString().length, b.toString().length);
  const errorAcceptance = 17;
  const limit = (1 / smallest) * 100 + 10 + errorAcceptance;
  const diff = biggest - smallest;

  log("a:", a.toString(), "b:", b.toString(), "limit:", limit, "diff:", diff);

  if (diff > limit) {
    return true;
  } else {
    return false;
  }
};
