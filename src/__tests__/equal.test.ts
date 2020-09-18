import { sync } from "glob";
import { resolve } from "path";
import { equal } from "../index";
import minimist from "minimist";

const doubleDashIndex = process.argv.indexOf("--");
const splitArgv = process.argv.slice(doubleDashIndex);
const args = minimist(
  process.argv.slice(doubleDashIndex ? doubleDashIndex + 1 : 2)
);

const fixtures = sync(args.t, {
  cwd: resolve(__dirname),
});

type CsonError = {
  location: any;
  code: string;
  filename: string;
  toString: () => string;
};

const isCsonError = (a: any): a is CsonError =>
  a.toString && a.code && a.location;

let testData = [];

try {
  testData = fixtures.map((f) => {
    console.log("f:", f);
    const data = require(f).default;
    return { data, filename: f };
  });
} catch (e) {
  console.error(e);
}

console.log("test data:", testData);

testData.forEach((d) => {
  describe(d.filename, () => {
    d.data.tests.forEach((t) => {
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
