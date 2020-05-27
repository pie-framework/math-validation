import { sync } from "glob";
import { basename, resolve } from "path";
import * as CSON from "cson";
import { readFileSync } from "fs-extra";
import { equal } from "../src/index";

const fixtures = sync(`fixtures/${basename(__filename, ".test.ts")}/*.cson`, {
  cwd: resolve(__dirname, ".."),
});

fixtures.forEach((f) => {
  const raw = readFileSync(f, "utf-8");
  const data = CSON.parse(raw);
  // console.log(JSON.stringify(data, null, "  "));
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
});
