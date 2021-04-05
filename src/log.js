"use strict";
exports.__esModule = true;
exports.logger = function (name) {
    if (process.env.NODE_ENV === "test") {
        var debug = require("debug");
        return debug(name);
    }
    else {
        return function () { };
    }
};
