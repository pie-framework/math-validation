import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import { isMathEqual, simplify } from ".";

const m: any = mathjs;

// check if equation is valid and find out the number of unknowns and their name
export const getUnknowns = (equation: MathNode) => {
  let variableNames: string[] = [];

  equation.traverse(function (node, path, parent) {
    if (
      node.isSymbolNode &&
      node?.name.length === 1 &&
      !variableNames.includes(node.name)
    ) {
      variableNames.push(node.name);
    }
  });

  variableNames.sort();

  return variableNames;
};

export const getCoefficients = (equation: MathNode) => {
  let result: number[] = [];

  try {
    const rationalizedEquation = m.rationalize(equation, {}, true);
    result = rationalizedEquation.coefficients;
  } catch (e) {}

  result = result.length === 0 ? [1, 0] : result;

  return result;
};

export const setXToOne = (equation: any, unknownName: string) => {
  let result: MathNode;

  result = equation.transform(function (node, path, parent) {
    if (node.isSymbolNode && node.name === unknownName) {

      return new m.ConstantNode(1);
    } else {

      return node;
    }
  });

  return result;
};

// solve x
export const solveLinearEquation = (coefficients: number[]) => {
  let result: number;

  // TO DO: solve quadratic equation
  if (coefficients.length === 3 && coefficients[0] === 0 ) {
    coefficients = coefficients.splice(1, 2);
  }

  if (coefficients.length === 2) {
    if (coefficients[0] === 0 && coefficients[1] === 0) {
      result = Infinity;
    } else if (coefficients[0] === 0) {
      result = 0;
    } else {
      // equation with no solution : if coefficient for x is 0 => division by zero => result == -Infinity
      result = m.divide(coefficients[0], -1 * coefficients[1]);
    }
  }

  return result;
};

export const equationsHaveTheSameUnknowns = (
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

export const compareEquations = (
  firstEquation: MathNode,
  secondEquation: MathNode
) => {
  let noFunctionOrArray: boolean = true;
  let firstSymbolNode: boolean = false;
  let symbolNode: boolean = false;
  let equivalence: boolean = false;

  firstEquation.traverse(function (node, path, parent) {
    noFunctionOrArray =
      noFunctionOrArray || node.isFunctionNode || node.isArrayNode;
    firstSymbolNode = firstSymbolNode || node.isSymbolNode;

    return node;
  });

  secondEquation.traverse(function (node, path, parent) {
    if (node.isFunctionNode || node.isArrayNode) {
      noFunctionOrArray = false;
    }

    if (node.isSymbolNode && firstSymbolNode) symbolNode = true;

    return node;
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

    let firstEquationUnknownsName = getUnknowns(firstExpression);
    let secondEquationUnknownsName = getUnknowns(secondExpression);

    if (
      !equationsHaveTheSameUnknowns(
        firstEquationUnknownsName,
        secondEquationUnknownsName
      )
    ) {
      return false;
    }

    let firstEquationCoefficients: number[];
    let secondEquationCoefficients: number[];

    // if both equations are linear in one variable then we solve "x" for both. If x has the same value then equations are equivalent
    if (firstEquationUnknownsName.length === 1) {
      firstEquationCoefficients = getCoefficients(firstExpression);
      secondEquationCoefficients = getCoefficients(secondExpression);

      equivalence =
        solveLinearEquation(firstEquationCoefficients) ===
        solveLinearEquation(secondEquationCoefficients);
    }

    // if both equations are linear in two variabled then we give value "1" for both "x". Doing this we get a linear equation in one variable "y". Then we solve "y" for both. If y has the same value then equations are equivalent
    if (firstEquationUnknownsName.length === 2) {
      let x = firstEquationUnknownsName[0];

      // solve expression for x=1
      let expraNoX = setXToOne(firstExpression, x);
      firstEquationCoefficients = getCoefficients(expraNoX);

      let exprbNoX = setXToOne(secondExpression, x);
      secondEquationCoefficients = getCoefficients(exprbNoX);

      // find y for both equations, where x equals 1
      let yFromFirstExpression = solveLinearEquation(firstEquationCoefficients);
      let yFromSecondExpression = solveLinearEquation(
        secondEquationCoefficients
      );

      // if y has the same value, for the same x then the expressions should be equivalent
      equivalence = yFromFirstExpression === yFromSecondExpression;
    }
  }

  return equivalence;
};
