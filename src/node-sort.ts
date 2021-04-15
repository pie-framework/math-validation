import { logger } from "./log";

import { mathjs as mjs, MathNode } from "./mathjs";
const m: any = mjs;

const log = logger("mv:node-sort");
/**
 * The plan with node sort was to sort all the nodes in an expression where possible
 * This means any commutative operators aka + and *.
 *
 * With symbols sorted - we shoud be able to call `node.equals(other)` and avoid having to call evaluate.
 */

const newCompare = (a: MathNode, b: MathNode): number => {
  // log(a.type);
  log("[compareNodes]: a:", a.toString(), a.type);
  log("[compareNodes]: b:", b.toString(), b.type);
  if (a.isSymbolNode && b.isSymbolNode) {
    // log(a.name, "> ", b.name);
    return a.name.localeCompare(b.name);
  }

  // both constants - sort by value
  if (a.isConstantNode && b.isConstantNode) {
    log("a.value", a.value);
    log("b.value", b.value);
    return a.value - b.value; //(b.name);
  }

  // constants before any other node
  if (a.isConstantNode && !b.isConstantNode) {
    return -1;
  }

  if (b.isConstantNode && !a.isConstantNode) {
    return 1;
  }

  // paranthesess after any other node
  if (!a.isParenthesisNode && b.isParenthesisNode) {
    return -1;
  }

  if (!b.isParenthesisNode && b.isParenthesisNode) {
    return 1;
  }

  // both parantheses node
  if (a.isParenthesisNode && b.isParenthesisNode) {
    const localeCompareResult = a.content.args
      .toString()
      .localeCompare(b.content.args.toString());

    if (localeCompareResult === 1) {
      return -1;
    } else if (localeCompareResult === -1) {
      return 1;
    }

    return localeCompareResult;
  }
};

const applySort = (node: MathNode) => {
  // log("node: ", node.toString());
  // log("path: ", path);
  // log("parent: ", parent);
  if (node.fn === "add") {
    node.args = node.args.sort(newCompare);
  } else if (node.fn === "multiply") {
    node.args = node.args.sort(newCompare);
  }
  return node;
};

const chainedSimilarOperators = (node) => {
  let ok = false;

  node.traverse((node, path, parent) => {
    if (parent && parent.fn === node.fn && !ok) {
      ok = true;
    }
  });

  return ok;
};

const argsIsOperatorNode = (node) => {
  let isOperator = false;

  node.args.map((args) => {
    if (args.isOperatorNode) {
      isOperator = true;
      return;
    }
  });

  return isOperator;
};

export const flattenNode = (node: MathNode) => {
  const operator = node.op;
  const func = node.fn;
  const sameOperator = chainedSimilarOperators(node);

  let resultNode = node;

  if (node.args && argsIsOperatorNode(node) && sameOperator) {
    resultNode = new m.OperatorNode(operator, func, []);

    node = node.traverse((node, path, parent) => {
      if (parent && parent.fn && parent.fn === func) {
        if (
          (node.fn && node.fn !== func) ||
          node.isSymbolNode ||
          node.isConstantNode
        ) {
          resultNode.args.push(node);
        }
      }
    });
  }

  return resultNode;
};

export const sortRelationalNode = (node: any) => {
  log("THIS IS THE START ++++", JSON.stringify(node));

  node.traverse((node, path, parent) => {
    let reverse = false;
    if (node.conditionals) {
      node.conditionals = node.conditionals.map((cond: any) => {
        if (cond === "smaller") {
          reverse = true;
          cond = "larger";
        } else if (cond === "smallerEq") {
          reverse = true;
          cond = "largerEq";
        }

        return cond;
      });
    }

    if (node.params && reverse) {
      node.conditionals.reverse();
      node.params.reverse();
    }

    log("node", JSON.stringify(node), parent && parent.type);

    if (parent && parent.type === "RelationalNode") {
      node = s(node);
    }
  });

  log("THIS IS THE END ++++", JSON.stringify(node));
  return node;
};

export const s = (node: MathNode) => {
  let resultNode = node;

  if (node.type === "RelationalNode") {
    return sortRelationalNode(node);
  }

  if (node.isOperatorNode && node.fn === "smaller") {
    node.op = ">";
    node.fn = "larger";
    node.args = node.args.reverse();
  }

  if (node.isOperatorNode && node.fn === "smallerEq") {
    node.op = ">=";
    node.fn = "largerEq";
    node.args = node.args.reverse();
  }

  if (node.isOperatorNode && (node.fn === "larger" || node.fn === "largerEq")) {
    node.args = node.args.map(s);

    return node;
  }

  resultNode = flattenNode(node).transform(applySort);

  log(resultNode, "resultNode");
  return resultNode;
};
