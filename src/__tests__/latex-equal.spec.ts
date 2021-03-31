import { sync } from "glob";
import { resolve, relative } from "path";
import { latexEqual } from "../index";
import minimist from "minimist";
import { LiteralOpts } from "../literal";
import { SymbolicOpts } from "../symbolic";

const doubleDashIndex = process.argv.indexOf("--");

const args = minimist(
  process.argv.slice(doubleDashIndex ? doubleDashIndex + 1 : 2)
);

const cwd = resolve(__dirname, "../..");

const fixtures = sync(args.t || "src/fixtures/latex-equal/**.ts", {
  cwd,
});

let testData = [];

type FixtureData = {
  target: string;
  mode?: "symbolic" | "literal";
  skip?: boolean;
  only?: boolean;
  label?: string;
  opts?: LiteralOpts | SymbolicOpts;
  eq: string | string[];
  ne: string | string[];
};

type FixtureModule = {
  mode?: "symbolic" | "literal";
  only?: boolean;
  skip?: boolean;
  tests: FixtureData[];
};

try {
  testData = fixtures.map((f) => {
    const r = relative(__dirname, f);
    const data = require(`./${r}`).default as FixtureModule;
    return { data, filename: f };
  });
} catch (e) {
  console.error(e);
}

const skipTest = (root: FixtureModule, test: FixtureData) => {
  if (process.env.NO_SKIP) {
    return false;
  }
  return root.skip !== undefined ? root.skip : test.skip;
};
const onlyTest = (root: FixtureModule, test: FixtureData) => {
  if (process.env.NO_ONLY) {
    return false;
  }
  return root.only !== undefined ? root.only : test.only;
};

const getLabel = (t: FixtureData) => {
  if (t.label) {
    return t.label.replace(/\$target/, t.target);
  }
  return t.target;
};

testData.forEach((d) => {
  // console.log("d.data", d.data);
  describe(d.filename, () => {
    d.data.tests.forEach((t) => {
      const skip = skipTest(d.data, t);
      const only = onlyTest(d.data, t); //.only !== undefined ? d.data.only : t.only;
      // console.log("skip?", skip, "only?", only);
      const dfn = skip ? describe.skip : only ? describe.only : describe;

      const label = getLabel(t);
      const mode = t.mode || d.data.mode;
      dfn(`[${mode}] ${label}`, () => {
        const eq = t.eq ? (Array.isArray(t.eq) ? t.eq : [t.eq]) : [];

        // console.log(t.label || t.target, "eq.length", eq.length);
        // console.log("mode!!", mode);
        eq.forEach((y) => {
          if (process.env.LEGACY === "true") {
            it(`[legacy] == ${y}`, () => {
              const l = latexEqual(t.target, y, {
                legacy: true,
                mode,
              });
              expect(l).toEqual(true);
            });
          }
          it(`== ${y}`, () => {
            const l = latexEqual(t.target, y, {
              legacy: false,
              mode,
              ...t.opts,
            });
            // console.log(l);
            expect(l).toEqual(true);
          });
        });

        const ne = t.ne ? (Array.isArray(t.ne) ? t.ne : [t.ne]) : [];

        ne.forEach((y) => {
          if (process.env.LEGACY === "true") {
            it(`[legacy] != ${y}`, () => {
              const l = latexEqual(t.target, y, { legacy: true, mode });
              expect(l).toEqual(false);
            });
          }
          it(`!= ${y}`, () => {
            const l = latexEqual(t.target, y, {
              legacy: false,
              mode,
              ...t.opts,
            });
            expect(l).toEqual(false);
          });
        });
      });
    });
  });
});
