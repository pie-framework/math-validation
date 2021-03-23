import { sync } from "glob";
import { resolve, relative, basename } from "path";
import { equal } from "../index";
import minimist from "minimist";

const doubleDashIndex = process.argv.indexOf("--");
// const splitArgv = process.argv.slice(doubleDashIndex);
const args = minimist(
  process.argv.slice(doubleDashIndex ? doubleDashIndex + 1 : 2)
);

// console.log(args);
const fixtures = sync(args.t || "fixtures/equal/**.ts", {
  cwd: resolve(__dirname),
});

let testData = [];

try {
  testData = fixtures.map((f) => {
    const data = require(`./${f}`).default;
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
          // it(`legacy == ${y}`, () => {
          //   expect(equal(t.target, y, { legacy: true })).toEqual(true);
          // });
          it(`new == ${y}`, () => {
            expect(equal(t.target, y, { legacy: false })).toEqual(true);
          });
        });

        const ne = t.ne ? (Array.isArray(t.ne) ? t.ne : [t.ne]) : [];

        ne.forEach((y) => {
          // it(`legacy != ${y}`, () => {
          //   expect(equal(t.target, y, { legacy: true })).not.toEqual(true);
          // });
          it(`new != ${y}`, () => {
            expect(equal(t.target, y, { legacy: false })).not.toEqual(true);
          });
        });
      });
    });
  });
});
