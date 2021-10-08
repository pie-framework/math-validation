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
  if (coefficients.length === 3 && coefficients[0] === 0) {
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
