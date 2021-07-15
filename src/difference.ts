import debug from "debug";
import { RawAst } from "./latex-equal";

const log = debug("difference");

export const differenceIsTooGreat = (a: RawAst, b: RawAst) => {
  console.time("differenceIsTooGreat");
  const smallest = Math.min(a.toString().length, b.toString().length);
  const biggest = Math.max(a.toString().length, b.toString().length);
  const errorAcceptance = 5;
  const limit = (1 / smallest) * 100 + 10 + errorAcceptance;
  const diff = biggest - smallest;

  log("a:", a.toString(), "b:", b.toString(), "limit:", limit, "diff:", diff);

  console.timeEnd("differenceIsTooGreat");
  if (diff > limit) {
    return true;
  } else {
    return false;
  }
};
