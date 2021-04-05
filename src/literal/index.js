"use strict";
exports.__esModule = true;
var log_1 = require("../log");
var log = log_1.logger("mv:literal");
exports.isMathEqual = function (a, b, opts) {
    log("a:", a.toTex(), "b: ", b.toTex());
    return a.equals(b);
};
