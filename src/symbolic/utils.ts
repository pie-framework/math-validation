import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import { simplify as customSimplify } from "./";
const { simplify } = mathjs;

const m: any = mathjs;

// expressions can be compared if we have at least one symbol node and has no function node or array
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
  });

  secondEquation.traverse(function (node, path, parent) {
    if (node.isFunctionNode || node.isArrayNode) {
      noFunctionOrArray = false;
    }

    if (node.isSymbolNode && firstSymbolNode) symbolNode = true;
  });

  return noFunctionOrArray && symbolNode;
};

// move the terms of the equations to the left hand side
export const transformEqualityInExpression = (equality: MathNode) =>
  // remove added/subtracted numbers/variables from both sides of the equation
  customSimplify(new m.OperatorNode("-", "subtract", equality.args));

// check if equation is valid and find out the number of variables and their name
export const getVariables = (equation: MathNode) => {
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

  return variableNames.sort();
};

export const getCoefficients = (equation: MathNode) => {
  // coefficients will be determined if equation has only one variable

  try {
    const rationalizedEquation = m.rationalize(equation, {}, true);
    return rationalizedEquation.coefficients;
  } catch (e) {
    // rationalize may fail if variable is isolated in a fraction
    // we give it another try to rationalize after applying a new round of simplify to separate the variable
    equation = simplify(equation, [
      { l: "(n1-n2)/n3", r: "n1/n3-n2/n3" },
      { l: "(n1+n2)/n3", r: "n1/n3+n2/n3" },
      { l: "(n1-n2)*n3/n4", r: "(n1*n3)/n4-(n2*n3)/n4" },
      { l: "(n1+n2)*n3/n4", r: "(n1*n3)/n4+(n2*n3)/n4" },
    ]);

    try {
      const rationalizedEquation = m.rationalize(equation, {}, true);
      return rationalizedEquation.coefficients;
    } catch (e) {}
  }

  return [1, 0];
};

export const setXToOne = (equation: any, variableName: string) =>
  equation.transform(function (node, path, parent) {
    if (node.isSymbolNode && node.name === variableName) {
      return new m.ConstantNode(1);
    }

    return node;
  });

// quadratic equation solver for a second-order polynomial equation such as ax^2 + bx + c = 0 for x, where a is not zero
export const solveQuadraticEquation = (coefficients: number[]) => {
  const [a,b,c] = coefficients;
  const root = Math.sqrt(b * b - (4 * a * c));
  
return [(-b + root) / (2 * a), (-b - root) / (2 * a)].sort()
}

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
      return Infinity;
    }

    if (coefficients[0] === 0) {
      return 0;
    }

    // equation with no solution : if coefficient for x is 0 => division by zero => result == -Infinity
    result =
      Math.round(m.divide(coefficients[0], -1 * coefficients[1]) * 10000) /
      10000;
  }

  return result;
};

export const equationsHaveTheSameVariables = (
  firstEquationVariables: string[],
  secondEquationVariables: string[]
) => {
  return (
    Array.isArray(firstEquationVariables) &&
    Array.isArray(secondEquationVariables) &&
    firstEquationVariables.length === secondEquationVariables.length &&
    firstEquationVariables.every(
      (variable, index) => variable === secondEquationVariables[index]
    )
  );
};
