import { sync } from "glob";
import { resolve, relative } from "path";
import { latexEqual } from "../index";
import minimist from "minimist";

const doubleDashIndex = process.argv.indexOf("--");

const args = minimist(
  process.argv.slice(doubleDashIndex ? doubleDashIndex + 1 : 2)
);

const cwd = resolve(__dirname, "../..");

const fixtures = sync(args.t || "src/fixtures/latex-equal/**.ts", {
  cwd,
});

let testData = [];

try {
  testData = fixtures.map((f) => {
    const r = relative(__dirname, f);
    const data = require(`./${r}`).default;
    return { data, filename: f };
  });
} catch (e) {
  console.error(e);
}

testData.forEach((d) => {
  describe(d.filename, () => {
    d.data.tests.forEach((t) => {
      const dfn = t.skip ? describe.skip : t.only ? describe.only : describe;
      dfn(t.label || t.target, () => {
        const eq = t.eq ? (Array.isArray(t.eq) ? t.eq : [t.eq]) : [];
        eq.forEach((y) => {
          // it(`legacy == ${y}`, async () => {
          //   const l = await latexEqual(t.target, y, { legacy: true });
          //   expect(l).toEqual(true);
          // });
          it(`new == ${y}`, async () => {
            const l = await latexEqual(t.target, y, { legacy: false });
            // console.log(l);
            expect(l).toEqual(true);
          });
        });

        const ne = t.ne ? (Array.isArray(t.ne) ? t.ne : [t.ne]) : [];

        ne.forEach((y) => {
          it(`legacy != ${y}`, async () => {
            const l = await latexEqual(t.target, y, { legacy: true });
            expect(l).toEqual(false);
          });
          it(`new != ${y}`, async () => {
            const l = await latexEqual(t.target, y, { legacy: false });
            expect(l).toEqual(false);
          });
        });
      });
    });
  });
});
