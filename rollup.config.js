import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import sucrase from "@rollup/plugin-sucrase";
import cleanup from 'rollup-plugin-cleanup';

const rollupConfig = {
  input: "src/demo.ts",
  output: {
    dir: "docs/js",
    name: "Demo",
  },
  plugins: [
    resolve({ browser: true, mainFields: ["module"] }),
    commonjs({}),
    sucrase({ transforms: ["typescript"] }),
    cleanup({ extensions: ["js", "ts"], compactComments: true }),
    strip({
      functions: ["console.*", 'debug',]
    }),
  ],

};

export default [rollupConfig];
