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
var error_1 = require("./error");
var lexer_1 = require("./lexer");
var flatten_1 = require("./flatten");
var log_1 = require("../log");
var log = log_1.logger("mv:latex-to-ast");
// UPDATETHIS: Delete or change to new license & package name
/*
 * recursive descent parser for math expressions
 *
 * Copyright 2014-2017 by
 *  Jim Fowler <kisonecat@gmail.com>
 *  Duane Nykamp <nykamp@umn.edu>
 *
 * This file is part of a math-expressions library
 *
 * math-expressions is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or at your option any later version.
 *
 * math-expressions is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */
// UPDATETHIS: Is this grammar still correct?
/* Grammar:

   statement_list =
   statement_list ',' statement |
   statement

   statement =
   '\\dots' |
   statement_a '|' statement_a |
   statement_a 'MID' statement_a |
   statement_a ':' statement_a
   **** statement_a '|' statement_a
        used with turning off '|' statement '|' in baseFactor
        tried only after parse error encountered

   statement_a =
   statement_a 'OR' statement_b |
   statement_b

   statement_b =
   statement_b 'AND' relation |
   relation

   relation =
   'NOT' relation |
   relation '=' expression |
   relation 'NE' expression |
   relation '<' expression |
   relation '>' expression |
   relation 'LE' expression |
   relation 'GE' expression |
   relation 'IN' expression |
   relation 'NOTIN' expression |
   relation 'NI' expression |
   relation 'NOTNI' expression |
   relation 'SUBSET' expression |
   relation 'NOTSUBSET' expression |
   relation 'SUPERSET' expression |
   relation 'NOTSUPERSET' expression |
   expression

   expression =
   expression '+' term |
   expression '-' term |
   expression 'UNION' term |
   expression 'INTERSECT' term |
   '+' term |
   term

   term =
   term '*' factor |
   term nonMinusFactor |
   term '/' factor |
   factor

   baseFactor =
   '(' statement_list ')' |
   '[' statement_list ']' |
   '{' statement_list '}' |
   'LBRACE' statement_list 'RBRACE' |
   '(' statement ',' statement ']' |
   '[' statement ',' statement ')' |
   '|' statement '|' |
   \frac{statement}{statement} |
   number |
   variable |
   modified_function '(' statement_list ')' |
   modified_applied_function '(' statement_list ')' |
   modified_function '{' statement_list '}' |
   modified_applied_function '{' statement_list '}' |
   modified_function |
   modified_applied_function factor |
   sqrt '[' statement ']' '{' statement '}' |
   baseFactor '_' baseFactor |
   *** modified_applied_function factor
       allowed only if allowSimplifiedFunctionApplication==true
   *** '|' statement '|'
       allowed only at beginning of factor or if not currently in absolute value

   modified_function =
   function |
   function '_' baseFactor |
   function '_' baseFactor '^' factor |
   function '^' factor
   function "'"
   function '_' baseFactor "'"
   function '_' baseFactor "'" '^' factor
   function "'" '^' factor
   *** where the "'" after the functions can be repeated

   modified_applied_function =
   applied_function |
   applied_function '_' baseFactor |
   applied_function '_' baseFactor '^' factor |
   applied_function '^' factor
   applied_function "'"
   applied_function '_' baseFactor "'"
   applied_function '_' baseFactor "'" '^' factor
   applied_function "'" '^' factor
   *** where the "'" after the applied_functions can be repeated

   nonMinusFactor =
   baseFactor |
   baseFactor '^' factor |
   baseFactor '!' and/or "'" |
   baseFactor '!' and/or "'"  '^' factor|
   *** where '!' and/or "'"  indicates arbitrary sequence of "!" and/or "'"

   factor =
   '-' factor |
   nonMinusFactor

*/
// Some of the latex commands that lead to spacing
exports.whitespace_rule = "\\s|\\\\,|\\\\!|\\\\ |\\\\>|\\\\;|\\\\:|\\\\quad\\b|\\\\qquad\\b|\\\\text{[a-zA-Z0-9\\s\\\\,\\\\.]+?}";
// in order to parse as scientific notation, e.g., 3.2E-12 or .7E+3,
// it must be at the end or followed a comma, &, |, \|, ), }, \}, ], \\, or \end
var sci_notat_exp_regex = "(E[+\\-]?[0-9]+\\s*($|(?=\\,|&|\\||\\\\\\||\\)|\\}|\\\\}|\\]|\\\\\\\\|\\\\end)))?";
// const latex_rules = [["\\\\neq(?![a-zA-Z])", "NE"]];
exports.latex_rules = [
    ["[0-9]+\\s*\\\\frac(?![a-zA-Z])", "MIXED_NUMBER"],
    ["[0-9|,]+(\\.[0-9]*)?" + sci_notat_exp_regex, "NUMBER"],
    ["\\.[0-9|,]+" + sci_notat_exp_regex, "NUMBER"],
    ["\\*", "*"],
    ["\\×", "*"],
    ["\\•", "*"],
    ["\\·", "*"],
    ["\\/", "/"],
    ["\\÷", "/"],
    ["%", "PERCENT"],
    ["\\\\%", "PERCENT"],
    ["-", "-"],
    ["\\+", "+"],
    ["\\^", "^"],
    ["\\(", "("],
    ["\\\\left\\s*\\(", "("],
    ["\\\\bigl\\s*\\(", "("],
    ["\\\\Bigl\\s*\\(", "("],
    ["\\\\biggl\\s*\\(", "("],
    ["\\\\Biggl\\s*\\(", "("],
    ["\\)", ")"],
    ["\\\\right\\s*\\)", ")"],
    ["\\\\bigr\\s*\\)", ")"],
    ["\\\\Bigr\\s*\\)", ")"],
    ["\\\\biggr\\s*\\)", ")"],
    ["\\\\Biggr\\s*\\)", ")"],
    ["\\[", "["],
    ["\\\\left\\s*\\[", "["],
    ["\\\\bigl\\s*\\[", "["],
    ["\\\\Bigl\\s*\\[", "["],
    ["\\\\biggl\\s*\\[", "["],
    ["\\\\Biggl\\s*\\[", "["],
    ["\\]", "]"],
    ["\\\\right\\s*\\]", "]"],
    ["\\\\bigr\\s*\\]", "]"],
    ["\\\\Bigr\\s*\\]", "]"],
    ["\\\\biggr\\s*\\]", "]"],
    ["\\\\Biggr\\s*\\]", "]"],
    ["\\|", "|"],
    ["\\\\left\\s*\\|", "|L"],
    ["\\\\bigl\\s*\\|", "|L"],
    ["\\\\Bigl\\s*\\|", "|L"],
    ["\\\\biggl\\s*\\|", "|L"],
    ["\\\\Biggl\\s*\\|", "|L"],
    ["\\\\right\\s*\\|", "|"],
    ["\\\\bigr\\s*\\|", "|"],
    ["\\\\Bigr\\s*\\|", "|"],
    ["\\\\biggr\\s*\\|", "|"],
    ["\\\\Biggr\\s*\\|", "|"],
    ["\\\\big\\s*\\|", "|"],
    ["\\\\Big\\s*\\|", "|"],
    ["\\\\bigg\\s*\\|", "|"],
    ["\\\\Bigg\\s*\\|", "|"],
    ["{", "{"],
    ["}", "}"],
    ["\\\\{", "LBRACE"],
    ["\\\\left\\s*\\\\{", "LBRACE"],
    ["\\\\bigl\\s*\\\\{", "LBRACE"],
    ["\\\\Bigl\\s*\\\\{", "LBRACE"],
    ["\\\\biggl\\s*\\\\{", "LBRACE"],
    ["\\\\Biggl\\s*\\\\{", "LBRACE"],
    ["\\\\}", "RBRACE"],
    ["\\\\right\\s*\\\\}", "RBRACE"],
    ["\\\\bigr\\s*\\\\}", "RBRACE"],
    ["\\\\Bigr\\s*\\\\}", "RBRACE"],
    ["\\\\biggr\\s*\\\\}", "RBRACE"],
    ["\\\\Biggr\\s*\\\\}", "RBRACE"],
    ["\\\\cdot(?![a-zA-Z])", "*"],
    ["\\\\div(?![a-zA-Z])", "/"],
    ["\\\\times(?![a-zA-Z])", "*"],
    ["\\\\frac(?![a-zA-Z])", "FRAC"],
    // [",", ","],
    [":", ":"],
    ["\\\\mid", "MID"],
    ["\\\\vartheta(?![a-zA-Z])", "LATEXCOMMAND", "\\theta"],
    ["\\\\varepsilon(?![a-zA-Z])", "LATEXCOMMAND", "\\epsilon"],
    ["\\\\varrho(?![a-zA-Z])", "LATEXCOMMAND", "\\rho"],
    ["\\\\varphi(?![a-zA-Z])", "LATEXCOMMAND", "\\phi"],
    ["\\\\infty(?![a-zA-Z])", "INFINITY"],
    ["\\\\asin(?![a-zA-Z])", "LATEXCOMMAND", "\\arcsin"],
    ["\\\\acos(?![a-zA-Z])", "LATEXCOMMAND", "\\arccos"],
    ["\\\\atan(?![a-zA-Z])", "LATEXCOMMAND", "\\arctan"],
    ["\\\\sqrt(?![a-zA-Z])", "SQRT"],
    ["\\\\land(?![a-zA-Z])", "AND"],
    ["\\\\wedge(?![a-zA-Z])", "AND"],
    ["\\\\lor(?![a-zA-Z])", "OR"],
    ["\\\\vee(?![a-zA-Z])", "OR"],
    ["\\\\lnot(?![a-zA-Z])", "NOT"],
    ["=", "="],
    ["\\\\neq(?![a-zA-Z])", "NE"],
    ["\\\\ne(?![a-zA-Z])", "NE"],
    ["\\\\not\\s*=", "NE"],
    ["\\\\leq(?![a-zA-Z])", "LE"],
    ["\\\\le(?![a-zA-Z])", "LE"],
    ["\\\\geq(?![a-zA-Z])", "GE"],
    ["\\\\ge(?![a-zA-Z])", "GE"],
    ["<", "<"],
    ["≤", "LE"],
    ["\\\\lt(?![a-zA-Z])", "<"],
    [">", ">"],
    ["≥", "GE"],
    ["\\\\gt(?![a-zA-Z])", ">"],
    ["\\\\in(?![a-zA-Z])", "IN"],
    ["\\\\notin(?![a-zA-Z])", "NOTIN"],
    ["\\\\not\\s*\\\\in(?![a-zA-Z])", "NOTIN"],
    ["\\\\ni(?![a-zA-Z])", "NI"],
    ["\\\\not\\s*\\\\ni(?![a-zA-Z])", "NOTNI"],
    ["\\\\subset(?![a-zA-Z])", "SUBSET"],
    ["\\\\not\\s*\\\\subset(?![a-zA-Z])", "NOTSUBSET"],
    ["\\\\supset(?![a-zA-Z])", "SUPERSET"],
    ["\\\\not\\s*\\\\supset(?![a-zA-Z])", "NOTSUPERSET"],
    ["\\\\cup(?![a-zA-Z])", "UNION"],
    ["\\\\cap(?![a-zA-Z])", "INTERSECT"],
    ["!", "!"],
    ["'", "'"],
    ["_", "_"],
    ["&", "&"],
    ["\\\\ldots", "LDOTS"],
    ["\\\\\\\\", "LINEBREAK"],
    ["\\\\begin\\s*{\\s*[a-zA-Z0-9]+\\s*}", "BEGINENVIRONMENT"],
    ["\\\\end\\s*{\\s*[a-zA-Z0-9]+\\s*}", "ENDENVIRONMENT"],
    ["\\\\var\\s*{\\s*[a-zA-Z0-9]+\\s*}", "VARMULTICHAR"],
    ["\\\\[a-zA-Z]+(?![a-zA-Z])", "LATEXCOMMAND"],
    ["[a-zA-Z]", "VAR"],
];
// defaults for parsers if not overridden by context
// if true, allowed applied functions to omit parentheses around argument
// if false, omitting parentheses will lead to a Parse Error
var allowSimplifiedFunctionApplicationDefault = true;
// allowed multicharacter latex symbols
// in addition to the below applied function symbols
var allowedLatexSymbolsDefault = [
    "alpha",
    "beta",
    "gamma",
    "Gamma",
    "delta",
    "Delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "Theta",
    "iota",
    "kappa",
    "lambda",
    "Lambda",
    "mu",
    "nu",
    "xi",
    "Xi",
    "pi",
    "Pi",
    "rho",
    "sigma",
    "Sigma",
    "tau",
    "Tau",
    "upsilon",
    "Upsilon",
    "phi",
    "Phi",
    "chi",
    "psi",
    "Psi",
    "omega",
    "Omega",
    "partial",
];
// Applied functions must be given an argument so that
// they are applied to the argument
var appliedFunctionSymbolsDefault = [
    "abs",
    "exp",
    "log",
    "ln",
    "log10",
    "sign",
    "sqrt",
    "erf",
    "acos",
    "acosh",
    "acot",
    "acoth",
    "acsc",
    "acsch",
    "asec",
    "asech",
    "asin",
    "asinh",
    "atan",
    "atanh",
    "cos",
    "cosh",
    "cot",
    "coth",
    "csc",
    "csch",
    "sec",
    "sech",
    "sin",
    "sinh",
    "tan",
    "tanh",
    "arcsin",
    "arccos",
    "arctan",
    "arccsc",
    "arcsec",
    "arccot",
    "cosec",
    "arg",
];
var missingFactorDefaultBehavior = function (token, e) {
    throw e;
};
exports.DEFAULT_OPTS = {
    allowSimplifiedFunctionApplication: allowSimplifiedFunctionApplicationDefault,
    allowedLatexSymbols: allowedLatexSymbolsDefault,
    appliedFunctionSymbols: appliedFunctionSymbolsDefault,
    /**
     *  Functions could have an argument, in which case they are applied
     * or, if they don't have an argument in parentheses, then they are treated
     * like a variable, except that trailing ^ and ' have higher precedence
     */
    functionSymbols: ["f", "g"],
    parseLeibnizNotation: true,
    missingFactor: missingFactorDefaultBehavior,
    unknownCommandBehavior: "error"
};
var LatexToAst = (function () {
    function LatexToAst(opts) {
        this.opts = __assign({}, exports.DEFAULT_OPTS, opts);
        if (this.opts.unknownCommandBehavior !== "error" &&
            this.opts.unknownCommandBehavior !== "passthrough") {
            throw new Error("Unknown behavior for unknown command: " +
                this.opts.unknownCommandBehavior);
        }
        this.lexer = new lexer_1["default"](exports.latex_rules, exports.whitespace_rule);
    }
    LatexToAst.prototype.advance = function (params) {
        this.token = this.lexer.advance(params);
        if (this.token.token_type === "INVALID") {
            throw new error_1.ParseError("Invalid symbol '" + this.token.original_text + "'", this.lexer.location);
        }
    };
    LatexToAst.prototype.return_state = function () {
        return {
            lexer_state: this.lexer.return_state(),
            token: Object.assign({}, this.token)
        };
    };
    LatexToAst.prototype.set_state = function (state) {
        this.lexer.set_state(state.lexer_state);
        this.token = Object.assign({}, state.token);
    };
    LatexToAst.prototype.convert = function (input, pars) {
        this.lexer.set_input(input);
        this.advance();
        var result = this.statement_list(pars);
        if (this.token.token_type !== "EOF") {
            throw new error_1.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
        }
        return flatten_1.flatten(result);
    };
    LatexToAst.prototype.statement_list = function (pars) {
        var list = [this.statement(pars)];
        while (this.token.token_type === ",") {
            this.advance();
            list.push(this.statement(pars));
        }
        if (list.length > 1)
            list = ["list"].concat(list);
        else
            list = list[0];
        return list;
    };
    LatexToAst.prototype.statement = function (opts) {
        if (opts === void 0) { opts = {}; }
        var _a = opts.inside_absolute_value, inside_absolute_value = _a === void 0 ? 0 : _a, _b = opts.unknownCommands, unknownCommands = _b === void 0 ? "error" : _b;
        // \ldots can be a statement by itself
        if (this.token.token_type === "LDOTS") {
            this.advance();
            return ["ldots"];
        }
        var original_state;
        try {
            original_state = this.return_state();
            var lhs = this.statement_a({
                inside_absolute_value: inside_absolute_value,
                unknownCommands: unknownCommands
            });
            //console.log("lhs:", lhs);
            if (this.token.token_type !== ":" && this.token.token_type !== "MID")
                return lhs;
            var operator = this.token.token_type === ":" ? ":" : "|";
            this.advance();
            var rhs = this.statement_a({ unknownCommands: unknownCommands });
            return [operator, lhs, rhs];
        }
        catch (e) {
            try {
                // if ran into problem parsing statement
                // then try again with ignoring absolute value
                // and then interpreting bar as a binary operator
                // return state to what it was before attempting to parse statement
                this.set_state(original_state);
                var lhs = this.statement_a({ parse_absolute_value: false });
                //console.log("lhs:", lhs);
                if (this.token.token_type[0] !== "|") {
                    throw e;
                }
                this.advance();
                var rhs = this.statement_a({ parse_absolute_value: false });
                return ["|", lhs, rhs];
            }
            catch (e2) {
                throw e; // throw original error
            }
        }
    };
    LatexToAst.prototype.statement_a = function (opts) {
        if (opts === void 0) { opts = {}; }
        var _a = opts.inside_absolute_value, inside_absolute_value = _a === void 0 ? 0 : _a, _b = opts.parse_absolute_value, parse_absolute_value = _b === void 0 ? true : _b, unknownCommands = opts.unknownCommands;
        var lhs = this.statement_b({
            inside_absolute_value: inside_absolute_value,
            parse_absolute_value: parse_absolute_value,
            unknownCommands: unknownCommands
        });
        while (this.token.token_type === "OR") {
            var operation = this.token.token_type.toLowerCase();
            this.advance();
            var rhs = this.statement_b({
                inside_absolute_value: inside_absolute_value,
                parse_absolute_value: parse_absolute_value,
                unknownCommands: unknownCommands
            });
            lhs = [operation, lhs, rhs];
        }
        return lhs;
    };
    LatexToAst.prototype.statement_b = function (params) {
        // split AND into second statement to give higher precedence than OR
        var lhs = this.relation(params);
        while (this.token.token_type === "AND") {
            var operation = this.token.token_type.toLowerCase();
            this.advance();
            var rhs = this.relation(params);
            lhs = [operation, lhs, rhs];
        }
        return lhs;
    };
    LatexToAst.prototype.relation = function (params) {
        if (this.token.token_type === "NOT" || this.token.token_type === "!") {
            this.advance();
            return ["not", this.relation(params)];
        }
        var lhs = this.expression(params);
        while (this.token.token_type === "=" ||
            this.token.token_type === "NE" ||
            this.token.token_type === "<" ||
            this.token.token_type === ">" ||
            this.token.token_type === "LE" ||
            this.token.token_type === "GE" ||
            this.token.token_type === "IN" ||
            this.token.token_type === "NOTIN" ||
            this.token.token_type === "NI" ||
            this.token.token_type === "NOTNI" ||
            this.token.token_type === "SUBSET" ||
            this.token.token_type === "NOTSUBSET" ||
            this.token.token_type === "SUPERSET" ||
            this.token.token_type === "NOTSUPERSET") {
            var operation = this.token.token_type.toLowerCase();
            var inequality_sequence = 0;
            if (this.token.token_type === "<" || this.token.token_type === "LE") {
                inequality_sequence = -1;
            }
            else if (this.token.token_type === ">" ||
                this.token.token_type === "GE") {
                inequality_sequence = 1;
            }
            this.advance();
            var rhs = this.expression(params);
            if (inequality_sequence === -1) {
                if (this.token.token_type === "<" || this.token.token_type === "LE") {
                    // sequence of multiple < or <=
                    var strict = ["tuple"];
                    if (operation === "<")
                        strict.push(true);
                    else
                        strict.push(false);
                    var args = ["tuple", lhs, rhs];
                    while (this.token.token_type === "<" ||
                        this.token.token_type === "LE") {
                        if (this.token.token_type === "<")
                            strict.push(true);
                        else
                            strict.push(false);
                        this.advance();
                        args.push(this.expression(params));
                    }
                    lhs = ["lts", args, strict];
                }
                else {
                    lhs = [operation, lhs, rhs];
                }
            }
            else if (inequality_sequence === 1) {
                if (this.token.token_type === ">" || this.token.token_type === "GE") {
                    // sequence of multiple > or >=
                    var strict = ["tuple"];
                    if (operation === ">")
                        strict.push(true);
                    else
                        strict.push(false);
                    var args = ["tuple", lhs, rhs];
                    while (this.token.token_type === ">" ||
                        this.token.token_type === "GE") {
                        if (this.token.token_type === ">")
                            strict.push(true);
                        else
                            strict.push(false);
                        this.advance();
                        args.push(this.expression(params));
                    }
                    lhs = ["gts", args, strict];
                }
                else {
                    lhs = [operation, lhs, rhs];
                }
            }
            else if (operation === "=") {
                lhs = ["=", lhs, rhs];
                // check for sequence of multiple =
                while (this.token.token_type === "=") {
                    this.advance();
                    lhs.push(this.expression(params));
                }
            }
            else {
                lhs = [operation, lhs, rhs];
            }
        }
        return lhs;
    };
    LatexToAst.prototype.expression = function (params) {
        if (this.token.token_type === "+")
            this.advance();
        var negative_begin = false;
        if (this.token.token_type === "-") {
            negative_begin = true;
            this.advance();
        }
        var lhs = this.term(params);
        if (negative_begin) {
            lhs = ["-", lhs];
        }
        while (this.token.token_type === "+" ||
            this.token.token_type === "-" ||
            this.token.token_type === "UNION" ||
            this.token.token_type === "INTERSECT") {
            var operation = this.token.token_type.toLowerCase();
            var negative = false;
            if (this.token.token_type === "-") {
                operation = "+";
                negative = true;
                this.advance();
            }
            else {
                this.advance();
                // @ts-ignore
                if (operation === "+" && this.token.token_type === "-") {
                    negative = true;
                    this.advance();
                }
            }
            var rhs = this.term(params);
            if (negative) {
                rhs = ["-", rhs];
            }
            lhs = [operation, lhs, rhs];
        }
        return lhs;
    };
    LatexToAst.prototype.term = function (params) {
        var lhs;
        try {
            lhs = this.factor(params);
        }
        catch (e) {
            lhs = this.opts.missingFactor(this.token, e);
            lhs = Number.isFinite(lhs) ? lhs : 0;
        }
        var keepGoing = false;
        do {
            keepGoing = false;
            if (this.token.token_type === "PERCENT") {
                this.advance();
                lhs = ["%", lhs];
                keepGoing = true;
            }
            else if (this.token.token_type === "*") {
                this.advance();
                lhs = ["*", lhs, this.factor(params)];
                keepGoing = true;
            }
            else if (this.token.token_type === "/") {
                this.advance();
                lhs = ["/", lhs, this.factor(params)];
                keepGoing = true;
            }
            else {
                // this is the one case where a | could indicate a closing absolute value
                var params2 = Object.assign({}, params);
                params2.allow_absolute_value_closing = true;
                var rhs = this.nonMinusFactor(params2);
                if (rhs !== false) {
                    lhs = ["*", lhs, rhs];
                    keepGoing = true;
                }
            }
        } while (keepGoing);
        return lhs;
    };
    LatexToAst.prototype.factor = function (params) {
        // console.log("factor:", this.token);
        // console.log("before: lexer state:", this.lexer.return_state());
        if (this.token.token_type === "-") {
            this.advance();
            return ["-", this.factor(params)];
        }
        var result = this.nonMinusFactor(params);
        // console.log("result", result);
        if (result === false) {
            if (this.token.token_type === "EOF") {
                throw new error_1.ParseError("Unexpected end of input", this.lexer.location);
            }
            else {
                //console.log("lexer state:", this.lexer.return_state());
                throw new error_1.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
            }
        }
        else {
            return result;
        }
    };
    LatexToAst.prototype.nonMinusFactor = function (params) {
        var result = this.baseFactor(params);
        // allow arbitrary sequence of factorials
        if (this.token.token_type === "!" || this.token.token_type === "'") {
            if (result === false)
                throw new error_1.ParseError("Invalid location of " + this.token.token_type, this.lexer.location);
            while (this.token.token_type === "!" || this.token.token_type === "'") {
                if (this.token.token_type === "!")
                    result = ["apply", "factorial", result];
                else
                    result = ["prime", result];
                this.advance();
            }
        }
        if (this.token.token_type === "^") {
            if (result === false) {
                throw new error_1.ParseError("Invalid location of ^", this.lexer.location);
            }
            this.advance();
            // do not allow absolute value closing here
            var params2 = Object.assign({}, params);
            delete params2.allow_absolute_value_closing;
            delete params2.inside_absolute_value;
            return ["^", result, this.factor(params2)];
        }
        return result;
    };
    LatexToAst.prototype.fraction = function (_a) {
        var _b = _a.inside_absolute_value, inside_absolute_value = _b === void 0 ? 0 : _b, _c = _a.parse_absolute_value, parse_absolute_value = _c === void 0 ? true : _c, _d = _a.allow_absolute_value_closing, allow_absolute_value_closing = _d === void 0 ? false : _d, _e = _a.unknownCommands, unknownCommands = _e === void 0 ? "error" : _e;
        this.advance();
        if (this.token.token_type !== "{") {
            throw new error_1.ParseError("Expecting {", this.lexer.location);
        }
        this.advance();
        // determine if may be a derivative in Leibniz notation
        if (this.opts.parseLeibnizNotation) {
            var original_state = this.return_state();
            var r = this.leibniz_notation();
            if (r) {
                // successfully parsed derivative in Leibniz notation, so return
                return r;
            }
            else {
                // didn't find a properly format Leibniz notation
                // so reset state and continue
                this.set_state(original_state);
            }
        }
        var numerator = this.statement({
            parse_absolute_value: parse_absolute_value,
            unknownCommands: unknownCommands
        });
        // @ts-ignore
        if (this.token.token_type !== "}") {
            throw new error_1.ParseError("Expecting }", this.lexer.location);
        }
        this.advance();
        if (this.token.token_type !== "{") {
            throw new error_1.ParseError("Expecting {", this.lexer.location);
        }
        this.advance();
        var denominator = this.statement({
            parse_absolute_value: parse_absolute_value,
            unknownCommands: unknownCommands
        });
        if (this.token.token_type !== "}") {
            throw new error_1.ParseError("Expecting }", this.lexer.location);
        }
        this.advance();
        return ["/", numerator, denominator];
    };
    LatexToAst.prototype.baseFactor = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.inside_absolute_value, inside_absolute_value = _c === void 0 ? 0 : _c, _d = _b.parse_absolute_value, parse_absolute_value = _d === void 0 ? true : _d, _e = _b.allow_absolute_value_closing, allow_absolute_value_closing = _e === void 0 ? false : _e, _f = _b.unknownCommands, unknownCommands = _f === void 0 ? "error" : _f;
        var result = false;
        if (this.token.token_type === "MIXED_NUMBER") {
            try {
                var t = this.token.token_text.split("\\\\frac");
                var numberString = t[0].trim();
                var number = parseInt(numberString, 10);
                var f = this.fraction({});
                return ["+", number, f];
            }
            catch (e) {
                throw new error_1.ParseError("Mixed number parsing failed: " + e.message);
            }
        }
        if (this.token.token_type === "FRAC") {
            return this.fraction({});
        }
        if (this.token.token_type === "BEGINENVIRONMENT") {
            var environment = /\\begin\s*{\s*([a-zA-Z0-9]+)\s*}/.exec(this.token.token_text)[1];
            if (["matrix", "pmatrix", "bmatrix"].includes(environment)) {
                var n_rows = 0;
                var n_cols = 0;
                var all_rows = [];
                var row = [];
                var n_this_row = 0;
                var last_token = this.token.token_type;
                this.advance();
                //@ts-ignore
                while (this.token.token_type !== "ENDENVIRONMENT") {
                    //@ts-ignore
                    if (this.token.token_type === "&") {
                        if (last_token === "&" || last_token === "LINEBREAK") {
                            // blank entry, let entry be zero
                            row.push(0);
                            n_this_row += 1;
                        }
                        last_token = this.token.token_type;
                        this.advance();
                        //@ts-ignore
                    }
                    else if (this.token.token_type === "LINEBREAK") {
                        if (last_token === "&" || last_token === "LINEBREAK") {
                            // blank entry, let entry be zero
                            row.push(0);
                            n_this_row += 1;
                        }
                        all_rows.push(row);
                        if (n_this_row > n_cols)
                            n_cols = n_this_row;
                        n_rows += 1;
                        n_this_row = 0;
                        row = [];
                        last_token = this.token.token_type;
                        this.advance();
                    }
                    else {
                        if (last_token === "&" ||
                            last_token === "LINEBREAK" ||
                            "BEGINENVIRONMENT") {
                            row.push(this.statement({
                                parse_absolute_value: parse_absolute_value,
                                unknownCommands: unknownCommands
                            }));
                            n_this_row += 1;
                            last_token = " ";
                        }
                        else {
                            throw new error_1.ParseError("Invalid location of " + this.token.original_text, this.lexer.location);
                        }
                    }
                }
                // token is ENDENVIRONMENT
                var environment2 = /\\end\s*{\s*([a-zA-Z0-9]+)\s*}/.exec(this.token.token_text)[1];
                if (environment2 !== environment) {
                    throw new error_1.ParseError("Expecting \\end{" + environment + "}", this.lexer.location);
                }
                // add last row
                if (last_token === "&") {
                    // blank entry, let entry be zero
                    row.push(0);
                    n_this_row += 1;
                }
                all_rows.push(row);
                if (n_this_row > n_cols)
                    n_cols = n_this_row;
                n_rows += 1;
                this.advance();
                // create matrix
                // @ts-ignore
                result = ["matrix", ["tuple", n_rows, n_cols]];
                var body = ["tuple"];
                for (var _i = 0, all_rows_1 = all_rows; _i < all_rows_1.length; _i++) {
                    var r = all_rows_1[_i];
                    var new_row = ["tuple"].concat(r);
                    //@ts-ignore
                    for (var i = r.length; i < n_cols; i += 1)
                        new_row.push(0);
                    // @ts-ignore
                    body.push(new_row);
                }
                // @ts-ignore
                result.push(body);
                return result;
            }
            else {
                throw new error_1.ParseError("Unrecognized environment " + environment, this.lexer.location);
            }
        }
        if (this.token.token_type === "NUMBER") {
            /** TODO: this is a bit primitive, should try and parse commas in numbers correctly */
            // @ts-ignore
            result = parseFloat(this.token.token_text.replace(/,/g, ""));
            this.advance();
        }
        else if (this.token.token_type === "INFINITY") {
            // @ts-ignore
            result = Infinity;
            this.advance();
        }
        else if (this.token.token_type === "SQRT") {
            this.advance();
            var root = 2;
            // @ts-ignore
            if (this.token.token_type === "[") {
                this.advance();
                var parameter_1 = this.statement({
                    parse_absolute_value: parse_absolute_value,
                    unknownCommands: unknownCommands
                });
                if (this.token.token_type !== "]") {
                    throw new error_1.ParseError("Expecting ]", this.lexer.location);
                }
                this.advance();
                root = parameter_1;
            }
            // @ts-ignore
            if (this.token.token_type !== "{") {
                throw new error_1.ParseError("Expecting {", this.lexer.location);
            }
            this.advance();
            var parameter = this.statement({
                parse_absolute_value: parse_absolute_value,
                unknownCommands: unknownCommands
            });
            if (this.token.token_type !== "}") {
                throw new error_1.ParseError("Expecting }", this.lexer.location);
            }
            this.advance();
            // @ts-ignore
            if (root === 2)
                result = ["apply", "sqrt", parameter];
            else
                result = ["^", parameter, ["/", 1, root]];
        }
        else if (this.token.token_type === "VAR" ||
            this.token.token_type === "LATEXCOMMAND" ||
            this.token.token_type === "VARMULTICHAR") {
            // @ts-ignore
            result = this.token.token_text;
            if (this.token.token_type === "LATEXCOMMAND") {
                // @ts-ignore
                result = result.slice(1);
                var isKnownCommand = 
                // @ts-ignore
                this.opts.appliedFunctionSymbols.includes(result) ||
                    // @ts-ignore
                    this.opts.functionSymbols.includes(result) ||
                    // @ts-ignore
                    this.opts.allowedLatexSymbols.includes(result);
                if (!isKnownCommand) {
                    if (this.unknownCommandBehavior === "error") {
                        throw new error_1.ParseError("Unrecognized latex command " + this.token.original_text, this.lexer.location);
                    }
                }
            }
            else if (this.token.token_type === "VARMULTICHAR") {
                // strip out name of variable from \var command
                // @ts-ignore
                result = /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(result)[1];
            }
            if (
            // @ts-ignore
            this.opts.appliedFunctionSymbols.includes(result) ||
                // @ts-ignore
                this.opts.functionSymbols.includes(result)) {
                var must_apply = false;
                // @ts-ignore
                if (this.opts.appliedFunctionSymbols.includes(result))
                    must_apply = true;
                this.advance();
                // @ts-ignore
                if (this.token.token_type === "_") {
                    this.advance();
                    var subresult = this.baseFactor({
                        parse_absolute_value: parse_absolute_value
                    });
                    // since baseFactor could return false, must check
                    if (subresult === false) {
                        if (this.token.token_type === "EOF") {
                            throw new error_1.ParseError("Unexpected end of input", this.lexer.location);
                        }
                        else {
                            throw new error_1.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
                        }
                    }
                    // @ts-ignore
                    result = ["_", result, subresult];
                }
                // @ts-ignore
                while (this.token.token_type === "'") {
                    // @ts-ignore
                    result = ["prime", result];
                    this.advance();
                }
                // @ts-ignore
                if (this.token.token_type === "^") {
                    this.advance();
                    // @ts-ignore
                    result = [
                        "^",
                        result,
                        this.factor({ parse_absolute_value: parse_absolute_value }),
                    ];
                }
                // @ts-ignore
                if (this.token.token_type === "{" || this.token.token_type === "(") {
                    var expected_right = void 0;
                    if (this.token.token_type === "{")
                        expected_right = "}";
                    else
                        expected_right = ")";
                    this.advance();
                    var parameters = this.statement_list();
                    if (this.token.token_type !== expected_right) {
                        throw new error_1.ParseError("Expecting " + expected_right, this.lexer.location);
                    }
                    this.advance();
                    if (parameters[0] === "list") {
                        // rename from list to tuple
                        parameters[0] = "tuple";
                    }
                    // @ts-ignore
                    result = ["apply", result, parameters];
                }
                else {
                    // if was an applied function symbol,
                    // cannot omit argument
                    if (must_apply) {
                        // @ts-ignore
                        if (!this.allowSimplifiedFunctionApplication)
                            throw new error_1.ParseError("Expecting ( after function", this.lexer.location);
                        // if allow simplied function application
                        // let the argument be the next factor
                        // @ts-ignore
                        result = [
                            "apply",
                            result,
                            this.factor({ parse_absolute_value: parse_absolute_value }),
                        ];
                    }
                }
            }
            else {
                this.advance();
            }
        }
        else if (this.token.token_type === "(" ||
            this.token.token_type === "[" ||
            this.token.token_type === "{" ||
            this.token.token_type === "LBRACE") {
            var token_left = this.token.token_type;
            var expected_right = void 0, other_right = void 0;
            if (this.token.token_type === "(") {
                expected_right = ")";
                other_right = "]";
            }
            else if (this.token.token_type === "[") {
                expected_right = "]";
                other_right = ")";
            }
            else if (this.token.token_type === "{") {
                expected_right = "}";
                other_right = null;
            }
            else {
                expected_right = "RBRACE";
                other_right = null;
            }
            this.advance();
            // @ts-ignore
            result = this.statement_list();
            var n_elements = 1;
            if (result[0] === "list") {
                // @ts-ignore
                n_elements = result.length - 1;
            }
            if (this.token.token_type !== expected_right) {
                if (n_elements !== 2 || other_right === null) {
                    throw new error_1.ParseError("Expecting " + expected_right, this.lexer.location);
                }
                else if (this.token.token_type !== other_right) {
                    throw new error_1.ParseError("Expecting ) or ]", this.lexer.location);
                }
                // half-open interval
                result[0] = "tuple";
                // @ts-ignore
                result = ["interval", result];
                var closed_1;
                if (token_left === "(")
                    closed_1 = ["tuple", false, true];
                else
                    closed_1 = ["tuple", true, false];
                // @ts-ignore
                result.push(closed_1);
            }
            else if (n_elements >= 2) {
                if (token_left === "(" || token_left === "{") {
                    result[0] = "tuple";
                }
                else if (token_left === "[") {
                    result[0] = "array";
                }
                else {
                    result[0] = "set";
                }
            }
            else if (token_left === "LBRACE") {
                if (result[0] === "|" || result[0] === ":") {
                    // @ts-ignore
                    result = ["set", result]; // set builder notation
                }
                else {
                    // @ts-ignore
                    result = ["set", result]; // singleton set
                }
            }
            this.advance();
        }
        else if (this.token.token_type[0] === "|" &&
            parse_absolute_value &&
            (inside_absolute_value === 0 ||
                !allow_absolute_value_closing ||
                this.token.token_type[1] === "L")) {
            // allow the opening of an absolute value here if either
            // - we aren't already inside an absolute value (inside_absolute_value==0),
            // - we don't allows an absolute value closing, or
            // - the | was marked as a left
            // otherwise, skip this token so that will drop out the factor (and entire statement)
            // to where the absolute value will close
            inside_absolute_value += 1;
            this.advance();
            result = this.statement({
                inside_absolute_value: inside_absolute_value,
                unknownCommands: unknownCommands
            });
            // @ts-ignore
            result = ["apply", "abs", result];
            if (this.token.token_type !== "|") {
                throw new error_1.ParseError("Expecting |", this.lexer.location);
            }
            this.advance();
        }
        if (this.token.token_type === "_") {
            if (result === false) {
                throw new error_1.ParseError("Invalid location of _", this.lexer.location);
            }
            this.advance();
            var subresult = this.baseFactor({
                parse_absolute_value: parse_absolute_value
            });
            if (subresult === false) {
                // @ts-ignore
                if (this.token.token_type === "EOF") {
                    throw new error_1.ParseError("Unexpected end of input", this.lexer.location);
                }
                else {
                    throw new error_1.ParseError("Invalid location of '" + this.token.original_text + "'", this.lexer.location);
                }
            }
            return ["_", result, subresult];
        }
        return result;
    };
    LatexToAst.prototype.leibniz_notation = function () {
        // attempt to find and return a derivative in Leibniz notation
        // if unsuccessful, return false
        var result = this.token.token_text;
        var deriv_symbol = "";
        var n_deriv = 1;
        var var1 = "";
        var var2s = [];
        var var2_exponents = [];
        if (this.token.token_type === "LATEXCOMMAND" &&
            result.slice(1) === "partial")
            deriv_symbol = "∂";
        else if (this.token.token_type === "VAR" && result === "d")
            deriv_symbol = "d";
        else
            return false;
        // since have just a d or ∂
        // one option is that have a ^ followed by an integer next possibly in {}
        this.advance();
        // @ts-ignore
        if (this.token.token_type === "^") {
            // so far have d or ∂ followed by ^
            // must be followed by an integer
            this.advance();
            var in_braces = false;
            if (this.token.token_type === "{") {
                in_braces = true;
                this.advance();
            }
            if (this.token.token_type !== "NUMBER") {
                return false;
            }
            n_deriv = parseFloat(this.token.token_text);
            if (!Number.isInteger(n_deriv)) {
                return false;
            }
            // found integer,
            // if in braces, require }
            if (in_braces) {
                this.advance();
                if (this.token.token_type !== "}") {
                    return false;
                }
            }
            this.advance();
        }
        // since have a d or ∂, optionally followed by ^ and integer
        // next we must have:
        // a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
        if (this.token.token_type === "VAR")
            var1 = this.token.token_text;
        else if (this.token.token_type === "VARMULTICHAR") {
            // strip out name of variable from \var command
            var1 = /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(this.token.token_text)[1];
        }
        else if (this.token.token_type === "LATEXCOMMAND") {
            result = this.token.token_text.slice(1);
            // @ts-ignore
            if (this.opts.allowedLatexSymbols.includes(result))
                var1 = result;
            else
                return false;
        }
        // Finished numerator.
        // Next need a } and {
        this.advance();
        // @ts-ignore
        if (this.token.token_type !== "}") {
            return false;
        }
        this.advance();
        if (this.token.token_type !== "{") {
            return false;
        }
        else {
            this.advance();
        }
        // In denominator now
        // find sequence of
        // derivative symbol followed by
        // - a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
        // optionally followed by a ^ and an integer
        // End when sum of exponents meets or exceeds n_deriv
        var exponent_sum = 0;
        while (true) {
            // next must be
            // - a VAR equal to deriv_symbol="d" or \partial when deriv_symbol = "∂"
            if (!((deriv_symbol === "d" &&
                this.token.token_type === "VAR" &&
                this.token.token_text === "d") ||
                (deriv_symbol === "∂" &&
                    this.token.token_type === "LATEXCOMMAND" &&
                    this.token.token_text.slice(1) === "partial"))) {
                return false;
            }
            // followed by
            // - a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
            this.advance();
            if (this.token.token_type === "VAR")
                var2s.push(this.token.token_text);
            else if (this.token.token_type === "VARMULTICHAR") {
                // strip out name of variable from \var command
                var2s.push(/\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(this.token.token_text)[1]);
            }
            else if (this.token.token_type === "LATEXCOMMAND") {
                var r = this.token.token_text.slice(1);
                // @ts-ignore
                if (this.allowedLatexSymbols.includes(r))
                    var2s.push(r);
                else {
                    return false;
                }
            }
            else {
                return false;
            }
            // have derivative and variable, now check for optional ^ followed by number
            var this_exponent = 1;
            this.advance();
            if (this.token.token_type === "^") {
                this.advance();
                var in_braces = false;
                if (this.token.token_type === "{") {
                    in_braces = true;
                    this.advance();
                }
                if (this.token.token_type !== "NUMBER") {
                    return false;
                }
                this_exponent = parseFloat(this.token.token_text);
                if (!Number.isInteger(this_exponent)) {
                    return false;
                }
                // if in braces, require }
                if (in_braces) {
                    this.advance();
                    if (this.token.token_type !== "}") {
                        return false;
                    }
                }
                this.advance();
            }
            var2_exponents.push(this_exponent);
            exponent_sum += this_exponent;
            if (exponent_sum > n_deriv) {
                return false;
            }
            // possibly found derivative
            if (exponent_sum === n_deriv) {
                // next token must be a }
                if (this.token.token_type !== "}") {
                    return false;
                }
                // found derivative!
                this.advance();
                var result_name = "derivative_leibniz";
                if (deriv_symbol === "∂")
                    result_name = "partial_" + result_name;
                // @ts-ignore
                result = [result_name];
                // @ts-ignore
                if (n_deriv === 1)
                    result.push(var1);
                else
                    result.push(["tuple", var1, n_deriv]);
                var r2 = [];
                for (var i = 0; i < var2s.length; i += 1) {
                    if (var2_exponents[i] === 1)
                        r2.push(var2s[i]);
                    else
                        r2.push(["tuple", var2s[i], var2_exponents[i]]);
                }
                r2 = ["tuple"].concat(r2);
                // @ts-ignore
                result.push(r2);
                return result;
            }
        }
    };
    return LatexToAst;
}());
exports.LatexToAst = LatexToAst;
