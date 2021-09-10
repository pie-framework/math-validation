import { mathjs } from "../mathjs";
import { isMathEqual } from ".";

const m: any = mathjs;
// const cannot be used since nerdamer gets modified when other modules are loaded
var nerdamer = require("nerdamer");
// Load additional modules. Algebra aand Calculus are required in order to use Solve.
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Solve");

export const compareEquations = (firstEquation: any, secondEquation: any) => {
  let noFunctionOrArray = true;
  let symbolNode = false;
  let equivalence = false;

  console.log(firstEquation.toTex(), "first");
  console.log(secondEquation.toTex(), "second");

  firstEquation.args = firstEquation.args.map((arg) => {
    noFunctionOrArray =
      !!noFunctionOrArray && (!arg.isFunctionNode || !arg.isArrayNode);
    if (arg.isSymbolNode) {
      symbolNode = true;
    }

    return arg;
  });

  console.log(firstEquation.toString(), "firstEquation");

  secondEquation.args = secondEquation.args.map((arg) => {
    noFunctionOrArray =
      !!noFunctionOrArray && (!arg.isFunctionNode || !arg.isArrayNode);

    if (arg.isSymbolNode) {
      symbolNode = true && symbolNode;
    }
    return arg;
  });

  console.log(secondEquation.toString(), "secondEquation");

  if (noFunctionOrArray && symbolNode) {
    let ae = new m.OperatorNode("-", "subtract", firstEquation.args);
    let be = new m.OperatorNode("-", "subtract", secondEquation.args);
    let minus = new m.ConstantNode(-1);

    equivalence = isMathEqual(ae, be);

    if (equivalence) {
      return true;
    }

    if (noFunctionOrArray && symbolNode) {
      be = new m.OperatorNode("*", "multiply", [minus, be]);
      equivalence = isMathEqual(ae, be);
    }

    if (equivalence) {
      return true;
    }

    console.log("[isMathEqual]", ae.toString(), "==?", be.toString());

    const filteredX = firstEquation.filter(function (node) {
      return node.isSymbolNode && node.name === "x";
    });

    const filteredY = firstEquation.filter(function (node) {
      return node.isSymbolNode && node.name === "y";
    });

    // if equations have 2 variables
    if (filteredX.length !== 0 && filteredY.length !== 0) {
      // solve expression for x=1
      let expraNoX = nerdamer(ae.toString(), { x: 1 });
      let exprA = nerdamer.solve(expraNoX.toString(), "y");

      console.log(expraNoX.toString(), "first expression, solved for x=1");

      console.log(exprA.toString(), "exprA");

      // solve expression for x=1
      let exprbNoX = nerdamer(be.toString(), { x: 1 });
      let exprB = nerdamer.solve(exprbNoX.toString(), "y");

      console.log(exprbNoX.toString(), "second expression, solved for x=1");

      console.log(exprB.toString(), "exprB");

      // if y is the same, for the same x then the expressions should be equivalent
      equivalence = exprA.toString() == exprB.toString();
    } else if (filteredX.length !== 0) {
      console.log(nerdamer.solve(ae.toString(), "x").toString(), "rezolva x a");
      console.log(nerdamer.solve(be.toString(), "x").toString(), "rezolva x b");
      equivalence =
        nerdamer.solve(ae.toString(), "x").toString() ===
        nerdamer.solve(be.toString(), "x").toString();
    }
  }
  return equivalence;
};
