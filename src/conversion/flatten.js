"use strict";
exports.__esModule = true;
var util_1 = require("./util");
exports.is_associative = {
    "+": true,
    "*": true,
    and: true,
    or: true,
    union: true,
    intersect: true
};
function flatten(expr) {
    // flatten tree with all associative operators
    var tree = util_1.get_tree(expr);
    if (!Array.isArray(tree))
        return tree;
    var operator = tree[0];
    var operands = tree.slice(1);
    operands = operands.map(function (v, i) {
        return flatten(v);
    });
    if (exports.is_associative[operator]) {
        var result = [];
        for (var i = 0; i < operands.length; i++) {
            if (Array.isArray(operands[i]) && operands[i][0] === operator) {
                result = result.concat(operands[i].slice(1));
            }
            else {
                result.push(operands[i]);
            }
        }
        operands = result;
    }
    return [operator].concat(operands);
}
exports.flatten = flatten;
exports.unflattenRight = function (expr) {
    // unflatten tree with associate operators
    // into a right heavy tree;
    var tree = util_1.get_tree(expr);
    if (!Array.isArray(tree))
        return tree;
    var operator = tree[0];
    var operands = tree.slice(1);
    operands = operands.map(function (v, i) {
        return exports.unflattenRight(v);
    });
    if (operands.length > 2 && exports.is_associative[operator]) {
        var result = [operator, operands[0], undefined];
        var next = result;
        for (var i = 1; i < operands.length - 1; i++) {
            next[2] = [operator, operands[i], undefined];
            next = next[2];
        }
        next[2] = operands[operands.length - 1];
        return result;
    }
    return [operator].concat(operands);
};
exports.unflattenLeft = function (expr) {
    // unflatten tree with associate operator op
    // into a left heavy tree;
    var tree = util_1.get_tree(expr);
    if (!Array.isArray(tree))
        return tree;
    var operator = tree[0];
    var operands = tree.slice(1);
    operands = operands.map(function (v, i) {
        return exports.unflattenLeft(v);
    });
    if (operands.length > 2 && exports.is_associative[operator]) {
        var result = [operator, undefined, operands[operands.length - 1]];
        var next = result;
        for (var i = operands.length - 2; i > 0; i--) {
            next[1] = [operator, undefined, operands[i]];
            next = next[1];
        }
        next[1] = operands[0];
        return result;
    }
    return [operator].concat(operands);
};
exports.allChildren = function (tree) {
    // find all children of operator of tree as though it had been flattened
    if (!Array.isArray(tree))
        return [];
    var operator = tree[0];
    var operands = tree.slice(1);
    if (!exports.is_associative[operator])
        return operands;
    return operands.reduce(function (a, b) {
        if (Array.isArray(b) && b[0] === operator) {
            return a.concat(exports.allChildren(b));
        }
        else
            return a.concat([b]);
    }, []);
};
