import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import {
  getVariables,
  equationsHaveTheSameVariables,
  getCoefficients,
  solveLinearEquation,
  setXToOne,
  transformEqualityInExpression,
  expressionsCanBeCompared,
} from "./utils";

const m: any = mathjs;

export const compareEquations = (
  firstEquation: MathNode,
  secondEquation: MathNode,
  isInequality: boolean
) => {
  let equivalence: boolean = false;

  if (expressionsCanBeCompared(firstEquation, secondEquation)) {
    let firstExpression = transformEqualityInExpression(firstEquation);
    let secondExpression = transformEqualityInExpression(secondEquation);

    if (firstExpression.equals(secondExpression)) {
      return true;
    }

    let firstEquationVariablesName = getVariables(firstExpression);
    let secondEquationVariablesName = getVariables(secondExpression);

    if (
      !equationsHaveTheSameVariables(
        firstEquationVariablesName,
        secondEquationVariablesName
      )
    ) {
      return false;
    }

    let firstEquationCoefficients: number[];
    let secondEquationCoefficients: number[];

    // if both equations are linear in one variable then we solve "x" for both. If x has the same value then equations are equivalent
    if (firstEquationVariablesName.length === 1) {
      firstEquationCoefficients = getCoefficients(firstExpression);
      secondEquationCoefficients = getCoefficients(secondExpression);

      const solutionForFirstEquation = solveLinearEquation(
        firstEquationCoefficients
      );
      const solutionForSecondEquation = solveLinearEquation(
        secondEquationCoefficients
      );

      equivalence = solutionForFirstEquation === solutionForSecondEquation;
    }

    // if both equations are linear in two variabled then we give value "1" for both "x". Doing this we get a linear equation in one variable "y". Then we solve "y" for both. If y has the same value then equations are equivalent
    if (firstEquationVariablesName.length === 2) {
      let x = firstEquationVariablesName[0];

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

    // determine equivalence between 2-way inequalities with 1 or 2 variables:
    // we treat 2-way inequalities the same way as linear equations in 1 or 2 variables; we find out the solutions that solve the inequality then compare them
    // we have one distinct case, when multiplying both parts of an inequality with a negative number, the sign must change direction
    if (equivalence && isInequality) {
      // check if direction should be changed
      return !(
        (m.isPositive(firstEquationCoefficients[0]) &&
          m.isNegative(firstEquationCoefficients[1]) &&
          m.isNegative(secondEquationCoefficients[0]) &&
          m.isPositive(secondEquationCoefficients[1])) ||
        (m.isNegative(firstEquationCoefficients[0]) &&
          m.isPositive(firstEquationCoefficients[1]) &&
          m.isPositive(secondEquationCoefficients[0]) &&
          m.isNegative(secondEquationCoefficients[1]))
      );
    }
  }

  return equivalence;
};
