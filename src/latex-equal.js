"use strict";
exports.__esModule = true;
var latex_to_ast_1 = require("./conversion/latex-to-ast");
var ast_to_mathjs_1 = require("./conversion/ast-to-mathjs");
var symbolic_1 = require("./symbolic");
var literal_1 = require("./literal");
var lta = new latex_to_ast_1.LatexToAst();
var atm = new ast_to_mathjs_1.AstToMathJs();
var toMathNode = function (latex) {
    var ast = lta.convert(latex);
    return atm.convert(ast);
};
exports.latexEqual = function (a, b, opts) {
    if (!a || !b) {
        return false;
    }
    if (a === b) {
        return true;
    }
    /**
     * TODO: apply a cutoff in difference in string size:
     * say correctResponse is 1+1=2
     * but user enters: 'arstasr arsoinerst9arsta8rstarsiotenarstoiarestaoristnarstoi'
     * This string is way bigger than it needs to be.
     * Say limit to 3 times the size of correct string?
     */
    var amo = toMathNode(a);
    var bmo = toMathNode(b);
    if (opts.mode === "literal") {
        return literal_1.isMathEqual(amo, bmo, opts.literal);
    }
    else {
        return symbolic_1.isMathEqual(amo, bmo, opts.symbolic);
    }
};
