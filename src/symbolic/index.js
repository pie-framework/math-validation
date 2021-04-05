"use strict";
exports.__esModule = true;
var log_1 = require("../log");
var mathjs_1 = require("../mathjs");
var log = log_1.logger("mv:symbolic");
var ms = mathjs_1.mathjs.simplify, rationalize = mathjs_1.mathjs.rationalize;
var SIMPLIFY_RULES = [
    { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
    { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
    { l: "(n^2)/n", r: "n" },
    { l: "(n^2) + n", r: "n * (n + 1)" },
    { l: "((n^n1) + n)/n", r: "n^(n1-1)+1" },
    { l: "(n^2) + 2n", r: "n * (n + 2)" },
    // { l: "(n/n1) * n2", r: "t" },
    // perfect square formula:
    { l: "(n1 + n2) ^ 2", r: "(n1 ^ 2) + 2*n1*n2 + (n2 ^ 2)" },
];
var simplify = function (v) {
    var rules = SIMPLIFY_RULES.concat(ms.rules);
    return ms(v, rules); //.concat(SIMPLIFY_RULES));
};
var normalize = function (a) {
    var r = a;
    try {
        r = rationalize(a, {}, true).expression;
    }
    catch (e) {
        // ok;
    }
    var s = simplify(r);
    log("[normalize] input: ", a.toString(), "output: ", s.toString());
    return s;
};
exports.isMathEqual = function (a, b, opts) {
    var as = normalize(a);
    var bs = normalize(b);
    log("[isMathEqual]", as.toString(), "==?", bs.toString());
    var firstTest = as.equals(bs);
    if (firstTest) {
        return true;
    }
    /**
     * Note: this seems very dodgy that we have to try a 2nd round of normalization here.
     * Why is this necessary and try and remove it.
     */
    var at = normalize(as);
    var bt = normalize(bs);
    return at.equals(bt);
};
