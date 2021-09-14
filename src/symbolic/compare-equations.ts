import { mathjs } from "../mathjs";
import { isMathEqual, simplify } from ".";

const m: any = mathjs;
// const cannot be used since nerdamer gets modified when other modules are loaded
var nerdamer = require("nerdamer");
// Load additional modules. Algebra aand Calculus are required in order to use Solve.
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Solve");

// check if equation is valid and find out the number of unknowns and their name
const getUnknowns = (equation: any) => {
  let variablesNumber: number = 0;
  let variableNames: string[] = [];

  equation.traverse(function (node, path, parent) {
    if (
      node.isSymbolNode &&
      node?.name.length === 1 &&
      !variableNames.includes(node.name)
    ) {
      variableNames.push(node.name);
      variablesNumber++;
    }
  });

  variableNames.sort();

  return {
    variablesNumber,
    variableNames,
  };
};

const equationsHaveTheSameUnknowns = (
  firstEquationUnknowns: string[],
  secondEquationUnknowns: string[]
) => {
  return (
    Array.isArray(firstEquationUnknowns) &&
    Array.isArray(secondEquationUnknowns) &&
    firstEquationUnknowns.length === secondEquationUnknowns.length &&
    firstEquationUnknowns.every(
      (unknonwn, index) => unknonwn === secondEquationUnknowns[index]
    )
  );
};

export const compareEquations = (firstEquation: any, secondEquation: any) => {
  let noFunctionOrArray: boolean = true;
  let symbolNode: boolean = false;
  let equivalence: boolean = false;

  firstEquation.args = firstEquation.args.map((arg) => {
    noFunctionOrArray =
      !!noFunctionOrArray && (!arg.isFunctionNode || !arg.isArrayNode);
    if (arg.isSymbolNode) {
      symbolNode = true;
    }

    return arg;
  });

  secondEquation.args = secondEquation.args.map((arg) => {
    noFunctionOrArray =
      !!noFunctionOrArray && (!arg.isFunctionNode || !arg.isArrayNode);

    if (arg.isSymbolNode) {
      symbolNode = true && symbolNode;
    }

    return arg;
  });

  // move the terms of the equations to the left hand side
  if (noFunctionOrArray && symbolNode) {
    let firstExpression = new m.OperatorNode(
      "-",
      "subtract",
      firstEquation.args
    );
    let secondExpression = new m.OperatorNode(
      "-",
      "subtract",
      secondEquation.args
    );

    // remove added/subtracted numbers/variables from both sides of the equation
    firstExpression = simplify(firstExpression);
    secondExpression = simplify(secondExpression);

    if (isMathEqual(firstExpression, secondExpression)) {
      return true;
    }

    let firstEquationUnknowns = getUnknowns(firstExpression);
    let secondEquationUnknowns = getUnknowns(secondExpression);

    if (
      !equationsHaveTheSameUnknowns(
        firstEquationUnknowns.variableNames,
        secondEquationUnknowns.variableNames
      )
    ) {
      return false;
    }

    if (firstEquationUnknowns.variablesNumber === 1) {
      let x = firstEquationUnknowns.variableNames[0];

      equivalence =
        nerdamer.solve(firstExpression.toString(), x).toString() ===
        nerdamer.solve(secondExpression.toString(), x).toString();
    }

    if (firstEquationUnknowns.variablesNumber === 2) {
      let x = firstEquationUnknowns.variableNames[0];
      let y = firstEquationUnknowns.variableNames[1];

      interface makeXProp {
        [key: string]: number;
      }

      let valueForX: makeXProp = {};
      const definedPropertyX: string = x;
      valueForX[definedPropertyX] = 1;
      // solve expression for x=1
     
      let expraNoX = nerdamer(firstExpression.toString(), valueForX);
      let exprbNoX = nerdamer(secondExpression.toString(), valueForX);

      // find y for both equations, where x equals 1
      let yFromFirstExpression = nerdamer.solve(expraNoX.toString(), y);
      let yFromSecondExpression = nerdamer.solve(exprbNoX.toString(), y);

      // if y has the same value, for the same x then the expressions should be equivalent
      equivalence =
        yFromFirstExpression.toString() == yFromSecondExpression.toString();
    }
  }

  return equivalence;
};
