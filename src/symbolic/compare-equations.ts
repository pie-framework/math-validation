import { mathjs } from "../mathjs";
import { isMathEqual, simplify } from ".";

const m: any = mathjs;

// check if equation is valid and find out the number of unknowns and their name
const getUnknowns = (equation: any) => {
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

const getCoefficients = (equation: any) => {
  const rationalizedEquation = m.rationalize(equation, {}, true);

  return rationalizedEquation.coefficients || [];
};

// solve x
const solveLinearEquation = (coefficients: number[]) => {
  let result: number;

  if (coefficients.length === 2) {
    result = m.divide(coefficients[0], -1 * coefficients[1]);
  }

  return result;
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

  firstEquation.traverse(function (node, path, parent) {
    noFunctionOrArray =
      noFunctionOrArray || node.isFunctionNode || node.isArrayNode;
    symbolNode = symbolNode || node.isSymbolNode;

    return node;
  });

  secondEquation.traverse(function (node, path, parent) {
    if (node.isFunctionNode || node.isArrayNode) {
      noFunctionOrArray = false;
    }

    if (node.isSymbolNode) {
      symbolNode = symbolNode && true;
    }

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

    console.log(firstExpression.toTex(), "first expression");
    console.log(secondExpression.toTex(), "second expression");
    // remove added/subtracted numbers/variables from both sides of the equation
    firstExpression = simplify(firstExpression);
    secondExpression = simplify(secondExpression);

    console.log(firstExpression.toTex(), "first expression after simplify");
    console.log(secondExpression.toTex(), "second expression after simplify");

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

    let firstEquationCoefficients = getCoefficients(firstExpression);
    let secondEquationCoefficients = getCoefficients(secondExpression);

    // if both equations are linear in one variable then we solve "x" for both. If x has the same value then equations are equivalent
    if (firstEquationUnknownsName.length === 1) {
      let x = firstEquationUnknownsName[0];

      equivalence =
        solveLinearEquation(firstEquationCoefficients) ===
        solveLinearEquation(secondEquationCoefficients);
    }

    // if both equations are linear in two variabled then we give value "1" for both "x". Doing this we get a linear equation in one variable "y". Then we solve "y" for both. If y has the same value then equations are equivalent
    if (secondEquationUnknownsName.length === 2) {
      let x = firstEquationUnknownsName[0];
      let y = secondEquationUnknownsName[1];

      interface makeXProp {
        [key: string]: number;
      }

      let valueForX: makeXProp = {};
      const definedPropertyX: string = x;
      valueForX[definedPropertyX] = 1;

      // // solve expression for x=1
      let expraNoX = m.rationalize(firstExpression, valueForX);

      let exprbNoX = m.rationalize(secondExpression, valueForX);

      console.log(expraNoX.toTex(), "equation solved for x = 1");
      console.log(exprbNoX.toTex(), "equation solved for x = 1");

      console.log(firstEquationCoefficients, "firstEquationCoefficients");
      console.log(secondEquationCoefficients, "secondEquationCoefficients");
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
