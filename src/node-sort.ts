import { logger } from "./log";

import { mathjs as mjs } from "./mathjs";

import { MathNode, nuclearMagnetonDependencies } from "mathjs";

const m: any = mjs;

import { AstToMathJs } from "./conversion/ast-to-mathjs";
import { LatexToAst } from "./conversion/latex-to-ast";

const log = logger("mv:node-sort");

//import { string } from "mathjs";
/**
 * The plan with node sort was to sort all the nodes in an expression where possible
 * This means any commutative operators aka + and *.
 *
 * With symbols sorted - we shoud be able to call `node.equals(other)` and avoid having to call evaluate.
 */

const lta = new LatexToAst();
const atm = new AstToMathJs();

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

  // symbolNode before operatorNode
  if (a.isSymbolNode && b.isOperatorNode) {
    return -1;
  }

  if (b.isSymbolNode && a.isOperatorNode) {
    return 1;
  }

  if (a.isOperatorNode && b.isOperatorNode) {
    const localeCompareResult = a.args
      .toString()
      .localeCompare(b.args.toString());

    return -localeCompareResult;
  }
};

const applySort = (node: MathNode) => {
  // log("node: ", node.toString());
  // log("path: ", path);
  // log("parent: ", parent);
  if (node.fn === "add" || node.fn === "multiply") {
    node.args = node.args.sort(newCompare);
    node.args = node.args.map(applySort);
  }
  // else if (node.fn === "divide") {
  //   node.args[0].args = node.args[0].args.sort(newCompare);
  //   node.args[0].args = node.args[0].args.map(applySort);
  // }

  return node;
};

const chainedSimilarOperators = (node) => {
  let ok = false;

  node.transform((node, path, parent) => {
    ok = ok || (parent && parent.fn === node.fn && !ok);
    if (ok) {
      return true;
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

const firstChildIsDivideNode = (args) => {
  let result = false;
  args.forEach((arg) => {
    if (arg.fn === "divide") {
      result = true;
    }

    return result;
  });

  return result;
};

const firstChildOperator = (args, operator) => {
  let result = false;
  args.forEach((arg) => {
    if (arg.fn === operator) {
      result = true;
    }

    return result;
  });

  return result;
};

export const flattenNode = (node: MathNode) => {
  node = node.transform((node, path, parent) => {
    while (node.isParenthesisNode && !parent && node.content) {
      node = node.content;
    }

    if (
      node.isParenthesisNode &&
      (parent?.op != "*" || (parent?.op == "*" && node.content.op != "+"))
    ) {
      while (node.content.isParenthesisNode) node = node.content;
      node = node.content;
    }

    return node;
  });

  let resultNode = node;

  resultNode = resultNode.transform((currentNode, path, parent) => {
    while (firstChildOperator(currentNode, currentNode.fn)) {
      const flatten = currentNode;

      flatten.traverse((node, path, parent) => {
        if (parent?.fn === node.fn) {
          const indexToRemove = path.replace(/[^0-9]/g, "");

          parent.args.splice(+indexToRemove, 1) || [];

          let argstoAdd = parent.args;

          node.args.forEach((arg) => {
            argstoAdd.push(arg);
          });

          console.log(node.op, "------op", node.fn, "fn----------");
          node = new m.OperatorNode(node.op, node.fn, argstoAdd);
        }
        return node;
      });
    }

    return currentNode;
  });

  resultNode = resultNode.transform((currentNode, path, parent) => {
    if (
      currentNode.fn === "multiply" &&
      firstChildIsDivideNode(currentNode.args)
    ) {
      let divisionNode = currentNode;

      if (
        divisionNode.fn === "multiply" &&
        firstChildIsDivideNode(divisionNode)
      ) {
        let newNode: MathNode;
        divisionNode = divisionNode.traverse((node, path, parent) => {
          // this condition will be at least once true

          if (parent && parent.fn === "multiply" && node.fn === "divide") {
            if (node.args[0].isOperatorNode) {
              parent.args.forEach((arg) => {
                if (!arg.isOperatorNode) {
                  node.args[0].args.push(arg);
                }
              });
            } else {
              const newArgs = [];

              newArgs.push(node.args[0]);

              parent.args.forEach((arg) => {
                if (!arg.isOperatorNode) {
                  newArgs.push(arg);
                }
              });

              node.args[0] = new m.OperatorNode("*", "multiply", newArgs);
            }
            newNode = node;
          }
        });
        return newNode;
      }
    } else {
      currentNode = currentNode;
    }

    return currentNode;
  });

  return resultNode;
};

export const sortRelationalNode = (node: any) => {
  log("THIS IS THE START ++++", JSON.stringify(node));

  const smaller = ["smaller", "smallerEq"];
  const bigger = ["larger", "largerEq"];

  const resultNode = node.transform((node, path, parent) => {
    let reverse = false;

    if (node.conditionals) {
      const smallerAndBigger =
        smaller.some((small) => node.conditionals.includes(small)) &&
        bigger.some((big) => node.conditionals.includes(big));

      if (node.conditionals.includes("equal")) {
        node.params.sort(newCompare);
      } else if (smallerAndBigger && node.params) {
        if (
          newCompare(node.params[0], node.params[node.params.length - 1]) > -1
        ) {
          node.params.reverse();
        }
      } else {
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
    }

    if (node.params && reverse) {
      node.conditionals.reverse();
      node.params.reverse();
    }

    if (parent && parent.type === "RelationalNode" && node.args) {
      node = s(node);
    }

    return node;
  });

  log("THIS IS THE END ++++", JSON.stringify(node));

  return resultNode;
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

  if (
    node.isOperatorNode &&
    (node.fn === "larger" || node.fn === "largerEq" || node.fn == "equal")
  ) {
    node.args = node.args.map(s);

    if (node.fn == "equal") {
      node.args = node.args.sort(newCompare);
    }
  }

  const flattened = flattenNode(node);

  resultNode = flattened.transform(applySort);

  return resultNode;
};
