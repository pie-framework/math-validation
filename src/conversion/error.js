"use strict";
exports.__esModule = true;
function ParseError(message, location) {
    this.name = "ParseError";
    this.message = message || "Error parsing input";
    this.stack = new Error().stack;
    this.location = location;
}
exports.ParseError = ParseError;
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;
