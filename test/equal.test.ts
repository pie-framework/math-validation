import { sync } from "glob";
import { basename, resolve } from "path";
import * as CSON from "cson";
import { readFileSync } from "fs-extra";
import { equal } from "../src/index";
import * as minimist from "minimist";

const doubleDashIndex = process.argv.indexOf("--");
const splitArgv = process.argv.slice(doubleDashIndex);
const args = minimist(
  process.argv.slice(doubleDashIndex ? doubleDashIndex + 1 : 2)
);

const getPattern = () => {
  const b = basename(__filename, ".test.ts");
  const filter = args.filter || "";
  const out = `fixtures/${b}/*${filter}*.cson`;
  // console.log("getPattern:", out, b, filter);
  return out;
};

const fixtures = sync(getPattern(), {
  cwd: resolve(__dirname, ".."),
});

fixtures.forEach((f) => {
  try {
    const raw = readFileSync(f, "utf-8");
    const data = CSON.parse(raw);
    describe(f, () => {
      data.tests.forEach((t) => {
        describe(t.label || t.target, () => {
          const eq = t.eq ? (Array.isArray(t.eq) ? t.eq : [t.eq]) : [];

          eq.forEach((y) => {
            it(` == ${y}`, () => {
              expect(equal(t.target, y, { foo: true })).toEqual(true);
            });
          });

          const ne = t.ne ? (Array.isArray(t.ne) ? t.ne : [t.ne]) : [];

          ne.forEach((y) => {
            it(`!= ${y}`, () => {
              expect(equal(t.target, y, { foo: true })).not.toEqual(true);
            });
          });
        });
      });
    });
  } catch (e) {
    console.error(e);
  }
});
