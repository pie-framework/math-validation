import { mathjs } from "../mathjs";
import { isMathEqual, simplify } from ".";

const m: any = mathjs;
// const cannot be used since nerdamer gets modified when other modules are loaded
let nerdamer = require("nerdamer");
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

  return variableNames;
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

  console.log(firstEquation.toTex(), "firstEquation");

  firstEquation.traverse(function (node, path, parent) {
    noFunctionOrArray =
      !!noFunctionOrArray && (!node.isFunctionNode || !node.isArrayNode);
    if (node.isSymbolNode) {
      symbolNode = true;
    }

    return node;
  });

  secondEquation.traverse(function (node, path, parent) {
    noFunctionOrArray =
      !!noFunctionOrArray && (!node.isFunctionNode || !node.isArrayNode);
    if (node.isSymbolNode) {
      symbolNode = true && symbolNode;
    }

    return node;
  });

  console.log(noFunctionOrArray, "noFunctionArray");
  console.log(symbolNode, "symbol node");

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

    console.log(firstExpression, "firstExpression");
    // remove added/subtracted numbers/variables from both sides of the equation
    firstExpression = simplify(firstExpression);
    secondExpression = simplify(secondExpression);

    console.log(firstExpression, "firstExpression after simplify");
    if (isMathEqual(firstExpression, secondExpression)) {
      return true;
    }

    let firstEquationUnknownsName = getUnknowns(firstExpression);
    let secondEquationUnknownsName = getUnknowns(secondExpression);

    console.log(firstEquationUnknownsName, "firstEquationUnknownsName");
    console.log(secondEquationUnknownsName, "secondEquationUnknownsName");

    if (
      !equationsHaveTheSameUnknowns(
        firstEquationUnknownsName,
        secondEquationUnknownsName
      )
    ) {
      return false;
    }

    if (firstEquationUnknownsName.length === 1) {
      let x = firstEquationUnknownsName[0];

      console.log(x, "x");
      equivalence =
        nerdamer.solve(firstExpression.toString(), x).toString() ===
        nerdamer.solve(secondExpression.toString(), x).toString();
    }

    if (secondEquationUnknownsName.length === 2) {
      let x = firstEquationUnknownsName[0];
      let y = secondEquationUnknownsName[1];

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
