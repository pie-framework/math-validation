import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import polyfills from "rollup-plugin-node-polyfills";
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';


const rollupConfig = {
    input: "lib/demo.js",
    output: {
        dir: "docs/js",
        format: "cjs",
        name: "Demo",

    },
    external: ["@pie-framework/math-expressions", "mathjs"],
    plugins: [
        nodeResolve({ browser: true }),
        json({ compact: true }),
        commonjs({}),
        builtins(),
        polyfills(),
        [typescript()],
    ]
};

export default [rollupConfig];
