import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

import sucrase from "@rollup/plugin-sucrase";

const rollupConfig = {
  input: "src/demo.ts",
  output: {
    dir: "docs/js",
    name: "Demo",
  },
  external: ["@pie-framework/math-expressions"],
  plugins: [
    resolve({ browser: true, mainFields: ["module"] }),
    commonjs({}),
    sucrase({ transforms: ["typescript"] }),
  ],
};

export default [rollupConfig];
