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
  // console.log("d.data", d.data);
  describe(d.filename, () => {
    d.data.tests.forEach((t) => {
      const skip = d.data.skip !== undefined ? d.data.skip : t.skip;
      const only = d.data.only !== undefined ? d.data.only : t.only;
      // console.log("skip?", skip, "only?", only);
      const dfn = skip ? describe.skip : only ? describe.only : describe;
      dfn(t.label || t.target, () => {
        const eq = t.eq ? (Array.isArray(t.eq) ? t.eq : [t.eq]) : [];

        // console.log(t.label || t.target, "eq.length", eq.length);
        const mode = t.mode || d.data.mode;
        // console.log("mode!!", mode);
        eq.forEach((y) => {
          if (process.env.LEGACY === "true") {
            it(`legacy == ${y}`, () => {
              const l = latexEqual(t.target, y, { legacy: true, mode });
              expect(l).toEqual(true);
            });
          }
          it(`== ${y}`, () => {
            const l = latexEqual(t.target, y, { legacy: false, mode });
            // console.log(l);
            expect(l).toEqual(true);
          });
        });

        const ne = t.ne ? (Array.isArray(t.ne) ? t.ne : [t.ne]) : [];

        ne.forEach((y) => {
          if (process.env.LEGACY === "true") {
            it(`legacy != ${y}`, () => {
              const l = latexEqual(t.target, y, { legacy: true, mode });
              expect(l).toEqual(false);
            });
          }
          it(`!= ${y}`, () => {
            const l = latexEqual(t.target, y, { legacy: false, mode });
            expect(l).toEqual(false);
          });
        });
      });
    });
  });
});
