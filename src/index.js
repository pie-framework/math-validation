"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var legacy_1 = require("./legacy");
var latex_equal_1 = require("./latex-equal");
/**
 * For dev purposes allow legacy to be called for comparison.
 * Eventually we'll remove this.
 */
exports.latexEqual = function (a, b, opts) {
    if (opts.legacy) {
        return opts.mode === "literal"
            ? legacy_1.literalEquals(a, b, __assign({}, opts, { isLatex: true }))
            : legacy_1.symbolicEquals(a, b, __assign({}, opts, { isLatex: true }));
    }
    else {
        return latex_equal_1.latexEqual(a, b, opts);
    }
};
