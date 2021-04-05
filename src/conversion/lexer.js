"use strict";
// lexer class
//
// Processes input string to return tokens
//
// Token rules:
// array of rules to identify tokens
// Rules will be applied in order until a match is found.
// Each rule is an array of two or three elements
//   First element: a string to be converted into a regular expression
//   Second element: the token type
exports.__esModule = true;
//   Third element (optional): replacement for actual string matched
var log_1 = require("../log");
var log = log_1.logger("mv:lexer");
var lexer = (function () {
    function lexer(rawRules, ws) {
        if (ws === void 0) { ws = "\\s"; }
        this.input = "";
        this.location = 0;
        // regular expression to identify whitespace at beginning
        // this.initial_whitespace = new RegExp("^(" + whitespace + ")+");
        this.whitespace = new RegExp("^(" + ws + ")+");
        this.rules = rawRules.map(function (r) {
            var m = r[0], char = r[1], extra = r[2];
            /**
             *   convert first element of each rule to a regular expression that
             * starts at the beginning of the string
             */
            var matcher = new RegExp("^" + m);
            var out = [matcher, char];
            if (extra) {
                out.push(extra);
            }
            return out;
        });
    }
    lexer.prototype.set_input = function (input) {
        if (typeof input !== "string")
            throw new Error("Input must be a string");
        this.input = input;
        this.location = 0;
    };
    lexer.prototype.return_state = function () {
        return { input: this.input, location: this.location };
    };
    lexer.prototype.set_state = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.input, input = _c === void 0 ? null : _c, _d = _b.location, location = _d === void 0 ? 0 : _d;
        if (input !== null) {
            this.input = input;
            this.location = location;
        }
    };
    lexer.prototype.advance = function (_a) {
        var _b = (_a === void 0 ? {} : _a).remove_initial_space, remove_initial_space = _b === void 0 ? true : _b;
        log("[advance] input: ", this.input);
        // Find next token at beginning of input and delete from input.
        // Update location to be the position in original input corresponding
        // to end of match.
        // Return token, which is an array of token type and matched string
        // if(this.input.(",")){}
        var result = this.whitespace.exec(this.input);
        var m = this.input.match(this.whitespace);
        log("input:", this.input, "result:", result, m);
        log("ws result:", result);
        if (result) {
            //first find any initial whitespace and adjust location
            var n_whitespace = result[0].length;
            this.input = this.input.slice(n_whitespace);
            this.location += n_whitespace;
            log("location:", this.location, "input now:", this.input);
            // don't remove initial space, return it as next token
            if (!remove_initial_space) {
                return {
                    token_type: "SPACE",
                    token_text: result[0],
                    original_text: result[0]
                };
            }
            // otherwise ignore initial space and continue
        }
        // check for EOF
        if (this.input.length === 0) {
            return {
                token_type: "EOF",
                token_text: "",
                original_text: ""
            };
        }
        // search through each token rule in order, finding first match
        result = null;
        for (var _i = 0, _c = this.rules; _i < _c.length; _i++) {
            var rule = _c[_i];
            result = rule[0].exec(this.input);
            if (result) {
                var n_characters = result[0].length;
                this.input = this.input.slice(n_characters);
                this.location += n_characters;
                break;
            }
        }
        // case that didn't find any matches
        if (result === null) {
            return {
                token_type: "INVALID",
                token_text: this.input[0],
                original_text: this.input[0]
            };
        }
        // log("rule:", rule);
        // found a match, set token
        if (rule.length > 2) {
            // overwrite text by third element of rule
            var out = {
                token_type: rule[1],
                token_text: rule[2],
                original_text: result[0]
            };
            return out;
        }
        else {
            // log("result: 0:", result[0]);
            return {
                token_type: rule[1],
                token_text: result[0],
                original_text: result[0]
            };
        }
    };
    lexer.prototype.unput = function (string) {
        // add string to beginning of input and adjust location
        if (typeof string !== "string")
            throw new Error("Input must be a string");
        this.location -= string.length;
        this.input = string + this.input;
    };
    return lexer;
}());
exports["default"] = lexer;
