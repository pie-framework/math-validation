import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import {simplify as customSimplify} from "./"
const { simplify } = mathjs;

const m: any = mathjs;

export const expressionsCanBeCompared = (
  firstEquation: MathNode,
  secondEquation: MathNode
): boolean => {
  let noFunctionOrArray: boolean = true;
  let firstSymbolNode: boolean = false;
  let symbolNode: boolean = false;

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

  return noFunctionOrArray && symbolNode;
};

// move the terms of the equations to the left hand side
export const transformEqualityInExpression = (equality: MathNode) => {
  const expression = new m.OperatorNode("-", "subtract", equality.args);

  // remove added/subtracted numbers/variables from both sides of the equation
  return customSimplify(expression);
};

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
  // add sanity check: rationalize is possible if we have only one unknown
  let result: number[] = [];
  // coefficients will be determined if equation has only one unknown

  try {
    const rationalizedEquation = m.rationalize(equation, {}, true);
    result = rationalizedEquation.coefficients;
  } catch (e) {
    equation = simplify(equation, [
      { l: "(n1-n2)/n3", r: "n1/n3-n2/n3" },
      { l: "(n1+n2)/n3", r: "n1/n3+n2/n3" },
      { l: "(n1-n2)*n3/n4", r: "(n1*n3)/n4-(n2*n3)/n4" },
      { l: "(n1+n2)*n3/n4", r: "(n1*n3)/n4+(n2*n3)/n4" },
    ]);

    try {
      const rat = m.rationalize(equation, {}, true);
      result = rat.coefficients;
    } catch(e) {}
  }

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

// TO DO: solve quadratic equation

// solve x
export const solveLinearEquation = (coefficients: number[]) => {
  let result: number;

  if (!coefficients) {
    return undefined;
  }

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
      result = Math.round(m.divide(coefficients[0], -1 * coefficients[1]) * 10000) / 10000;
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

//solve unknown for linear equation/inequality in one variable
export const findX = (inequality: MathNode): number => {
  let expression = transformEqualityInExpression(inequality);

  return solveLinearEquation(
    getCoefficients(expression)
  );
};