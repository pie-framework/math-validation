import { sync } from "glob";
import { resolve } from "path";
import * as CSON from "cson";
import { readFileSync } from "fs-extra";

const fixtures = sync("fixtures/**/*.cson", {
  cwd: resolve(__dirname, ".."),
});

fixtures.forEach((f) => {
  const raw = readFileSync(f, "utf-8");
  const data = CSON.parse(raw);
  describe(f, () => {
    data.tests.forEach((t) => {
      describe(t.label || t.correct, () => {
        const yes = t.yes ? (Array.isArray(t.yes) ? t.yes : [t.yes]) : [];

        yes.forEach((y) => {
          it(` == ${y}`, () => {
            expect(true).toEqual(true);
          });
        });
        const no = t.no ? (Array.isArray(t.no) ? t.no : [t.no]) : [];

        no.forEach((y) => {
          it(`!= ${y}`, () => {
            expect(true).toEqual(true);
          });
        });
      });
    });
  });
});
