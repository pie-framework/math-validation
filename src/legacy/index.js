"use strict";
/* eslint-disable no-console */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
/**
 * This is the old implementation that we had in pie-lib.
 * Used as a reference against new impl. Not to be worked on.
 */
var mathjs = require("mathjs");
var math_expressions_1 = require("@pie-framework/math-expressions");
var decimalCommaRegex = /,/g;
var decimalRegex = /\.|,/g;
var decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;
var rationalizeAllPossibleSubNodes = function (expression) {
    return rationalize(mathjs.parse(expression));
};
var rationalize = function (tree) {
    var transformedTree = tree.transform(function (node) {
        try {
            var rationalizedNode = mathjs.rationalize(node);
            return rationalizedNode;
        }
        catch () {
            return node;
        }
    });
    return transformedTree;
};
function prepareExpression(string, isLatex) {
    var returnValue = string ? string.trim() : "";
    returnValue = returnValue.replace(decimalCommaRegex, ".");
    returnValue = isLatex
        ? exports.latexToText("" + returnValue)
        : exports.textToMathText("" + returnValue, {
            unknownCommands: "passthrough"
        }).toString();
    // console.log("returnValue:", returnValue);
    returnValue = returnValue.replace("=", "==");
    return rationalizeAllPossibleSubNodes(returnValue);
}
var latexToAstOpts = {
    missingFactor: function (token, e) {
        console.warn("missing factor for: ", token.token_type);
        if (token.token_type === "NUMBER") {
            throw e;
        }
        return 0;
    },
    unknownCommandBehavior: "passthrough"
};
var astToTextOpts = {
    unicode_operators: {
        ne: function (operands) {
            return operands.join(" != ");
        },
        "%": function (operands) {
            return "percent(" + operands[0] + ")";
        }
    }
};
exports.latexToText = function (latex, extraOtps) {
    if (extraOtps === void 0) { extraOtps = {}; }
    var la = new math_expressions_1["default"].converters.latexToAstObj(__assign({}, latexToAstOpts, extraOtps));
    var at = new math_expressions_1["default"].converters.astToTextObj(__assign({}, astToTextOpts, extraOtps));
    var ast = la.convert(latex);
    return at.convert(ast);
};
exports.textToMathText = function (latex, extraOtps) {
    if (extraOtps === void 0) { extraOtps = {}; }
    var la = new math_expressions_1["default"].converters.textToAstObj(__assign({}, latexToAstOpts, extraOtps));
    var at = new math_expressions_1["default"].converters.astToTextObj(__assign({}, astToTextOpts, extraOtps));
    var ast = la.convert(latex);
    return at.convert(ast);
};
function shouldRationalizeEntireTree(tree) {
    var shouldDoIt = true;
    // we need to iterate the entire tree to check for some conditions that might make rationalization impossible
    try {
        tree.traverse(function (node) {
            // if we have a variable as an exponent for power operation, we should not rationalize
            // try to see if there are power operations with variable exponents
            if (node.type === "OperatorNode" && node.fn === "pow") {
                var exponent = node.args[1];
                // try to see if it can be compiled and evaluated - if it's a non-numerical value, it'll throw an error
                exponent.compile().eval();
            }
            // we cannot have variables for unresolved function calls either
            if (node.type === "FunctionNode") {
                //try to see if the argument that the function is called with can be resolved as non-variable
                var functionParameter = node.args[0];
                // if it holds variables, this will throw an error
                functionParameter.compile().eval();
            }
        });
        mathjs.rationalize(tree);
    }
    catch () {
        shouldDoIt = false;
    }
    return shouldDoIt;
}
function containsDecimal(expression) {
    if (expression === void 0) { expression = ""; }
    return expression.match(decimalRegex);
}
var SIMPLIFY_RULES = [
    { l: "n1^(1/n2)", r: "nthRoot(n1, n2)" },
    { l: "sqrt(n1)", r: "nthRoot(n1, 2)" },
];
var simplify = function (v) {
    return mathjs.simplify(v, SIMPLIFY_RULES.concat(mathjs.simplify.rules));
}; //.concat(SIMPLIFY_RULES));
// const log = debug('@pie-element:math-inline:controller');
// const decimalRegex = /\.|,/g;
// const decimalCommaRegex = /,/g;
var textRegex = /\\text\{([^{}]+)\}/g;
// const decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;
var stripTargets = [
    /{/g,
    /}/g,
    /\[/g,
    /]/g,
    /\\ /g,
    /\\/g,
    /\\s/g,
    /left/g,
    /right/g,
    / /g,
];
function stripForStringCompare(answer) {
    if (answer === void 0) { answer = ""; }
    var stripped = answer;
    stripTargets.forEach(function (stripTarget) {
        return (stripped = stripped.replace(stripTarget, ""));
    });
    return stripped;
}
function handleStringBasedCheck(acceptedValues, answerItem) {
    var answerValueToUse = processAnswerItem(answerItem, true);
    var answerCorrect = false;
    for (var i = 0; i < acceptedValues.length; i++) {
        var acceptedValueToUse = processAnswerItem(acceptedValues[i], true);
        answerCorrect = answerValueToUse === acceptedValueToUse;
        if (answerCorrect === true) {
            break;
        }
    }
    return answerCorrect;
}
/**
 * TODO:
 *
 * We have `stringCheck` which if true disabled 'literal' and 'symbolic' so really it should be a validation method. And if it is what's the difference between it and 'literal'?
 *
 * We should support a equivalence option per correct response like:
 * responses: [ { answer: '..', validation: 'symbolic', alternates: [{ value: '..', validation: 'stringCompare'}, 'abc'] } ]
 *
 * if option is a string it is turned into an object w/ inherited opts.
 *
 * This would override any shared setting at the root.
 */
function processAnswerItem(answerItem, isLiteral) {
    if (answerItem === void 0) { answerItem = ""; }
    // looks confusing, but we're replacing U+002D and U+2212 (minus and hyphen) so we have the same symbol everywhere consistently
    // further processing is to be added here if needed
    var newAnswerItem = answerItem.replace("−", "-");
    newAnswerItem = newAnswerItem.replace(/\\cdot/g, "\\times");
    // also ignore text nodes, just swap out with empty string
    newAnswerItem = newAnswerItem.replace(textRegex, "");
    newAnswerItem = newAnswerItem.replace(/\\ /g, "").replace(/ /g, "");
    // eslint-disable-next-line no-useless-escape
    newAnswerItem = newAnswerItem.replace(/\\%/g, "").replace(/%/g, "");
    return isLiteral ? stripForStringCompare(newAnswerItem) : newAnswerItem;
}
exports.literalEquals = function (valueOne, valueTwo, opts) {
    var answerValueToUse = processAnswerItem(valueOne, true);
    var acceptedValueToUse = processAnswerItem(valueTwo, true);
    if (opts.allowThousandsSeparator) {
        if (containsDecimal(answerValueToUse) &&
            decimalWithThousandSeparatorNumberRegex.test(answerValueToUse)) {
            answerValueToUse = answerValueToUse.replace(decimalCommaRegex, "");
        }
        if (containsDecimal(acceptedValueToUse) &&
            decimalWithThousandSeparatorNumberRegex.test(acceptedValueToUse)) {
            acceptedValueToUse = acceptedValueToUse.replace(decimalCommaRegex, "");
        }
    }
    return acceptedValueToUse === answerValueToUse;
};
exports.symbolicEquals = function (valueOne, valueTwo, options) {
    if (options === void 0) { options = {}; }
    var 
    // if explicitly set to false, having a decimal value in either side will result in a false equality
    // regardless of mathematical correctness
    allowDecimals = options.allowDecimals, isLatex = options.isLatex, // if the passed in values are latex, they need to be escaped
    inverse = options.inverse;
    var valueOneToUse = valueOne;
    var valueTwoToUse = valueTwo;
    if (allowDecimals === false) {
        if (containsDecimal(valueOne) || containsDecimal(valueTwo)) {
            return false;
        }
    }
    else if (allowDecimals === true) {
        if (containsDecimal(valueOne) &&
            decimalWithThousandSeparatorNumberRegex.test(valueOne)) {
            valueOneToUse = valueOne.replace(decimalCommaRegex, "");
        }
        if (containsDecimal(valueTwo) &&
            decimalWithThousandSeparatorNumberRegex.test(valueTwo)) {
            valueTwoToUse = valueTwo.replace(decimalCommaRegex, "");
        }
    }
    var preparedValueOne = prepareExpression(valueOneToUse, isLatex);
    var preparedValueTwo = prepareExpression(valueTwoToUse, isLatex);
    var one = shouldRationalizeEntireTree(preparedValueOne)
        ? mathjs.rationalize(preparedValueOne)
        : preparedValueOne;
    var two = shouldRationalizeEntireTree(preparedValueTwo)
        ? mathjs.rationalize(preparedValueTwo)
        : preparedValueTwo;
    one = simplify(one);
    two = simplify(two);
    var equals = one.equals(two);
    return inverse ? !equals : equals;
};
exports.ave = function (a, b) {
    var am = mathjs.parse(a);
    var bm = mathjs.parse(b);
    var arm = simplify(am);
    var brm = simplify(bm);
    return arm.equals(brm);
};
