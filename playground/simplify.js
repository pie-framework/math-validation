const  mathjs = require( "mathjs");

// import _ from "lodash";
// import * as me from "@pie-framework/math-expressions";
// import { diff } from "deep-diff";
const e = "(x^2)/x";
const node = mathjs.parse(e);
const o = mathjs.simplify(node);
console.log("node simplified:", o);