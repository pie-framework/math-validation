import { mathjs } from "../mathjs";
import math, { MathNode, number } from "mathjs";
import { equationsCanBeCompared, equationsHaveTheSameUnknowns, getCoefficients, getUnknowns, solveLinearEquation, transformEqualityInExpression } from "./utils";

const m: any = mathjs;

export type InequalitiesPairs = {
  leftHandInequality: MathNode;
  rightHandInequality: MathNode;
};

export type xRange = {
  inferiorLimit: number;
  superiorLimit: number;
};

const operation = (signName: string) => (signName === "larger" ? ">" : "≥");

const breakInequality = (compoundInequality: any): InequalitiesPairs => {
  return {
    leftHandInequality: new m.OperatorNode(
      operation(compoundInequality.conditionals[0]),
      compoundInequality.conditionals[0],
      [compoundInequality.params[0], compoundInequality.params[1]]
    ),
    rightHandInequality: new m.OperatorNode(
      operation(compoundInequality.conditionals[1]),
      compoundInequality.conditionals[0],
      [compoundInequality.params[1], compoundInequality.params[2]]
    ),
  };
};

const findX = (inequality: MathNode): number => {
  // TO DO: sanity checks
  let expression = transformEqualityInExpression(inequality);
  let result: number;
  // TO DO: must chek if we have the same unknowns

  let equationUnknownsName = getUnknowns(expression);
  let equationCoefficients: number[];

  if (equationUnknownsName.length === 1) {
    equationCoefficients = getCoefficients(expression);
  }

  result = solveLinearEquation(
    equationCoefficients
  );

  return result
};


export const getLimit = (expressionsPair :InequalitiesPairs, limitType:string):number => {
  const xFirstInequality = findX(expressionsPair.rightHandInequality);
  const xSecondInequality = findX(expressionsPair.leftHandInequality);

  if (limitType === "inferior") {
    return Math.min(xFirstInequality,xSecondInequality)
  } else {
    return Math.max(xFirstInequality,xSecondInequality)
  }
}


export const compareCompoundInequations = (
  firstInequation: any,
  secondInequation: any
) => {
  let equality: boolean = false;

  const result = firstInequation.conditionals.every(
    (relation: string) =>
      secondInequation.conditionals.includes(relation) &&
      firstInequation.conditionals?.length === 2 &&
      firstInequation.params?.length === 3 && equationsCanBeCompared (firstInequation,secondInequation)
  );

  if (!result) {
    return false;
  } else {
    const firstInequalityUnknownsName = getUnknowns(firstInequation);
    const secondInequalityUnknownsName = getUnknowns(secondInequation);

    if (
      !equationsHaveTheSameUnknowns(
        firstInequalityUnknownsName,
        secondInequalityUnknownsName
      )
    ) {
      return false;
    }

    console.log(firstInequation.toString(), "first inequation")
    console.log(secondInequation.toString(), "second inequation")

    const firstInequalities = breakInequality(firstInequation);
    const secondInequalities = breakInequality(secondInequation);
    console.log(secondInequalities.leftHandInequality, secondInequalities.rightHandInequality, "second inequalities")



    let firstInequalitiesSolution: xRange = {
      inferiorLimit: getLimit(firstInequalities, "inferior"),
      superiorLimit:getLimit(firstInequalities, "superior"),
    };
    console.log(firstInequalitiesSolution)
    let secondInequalitiesSolution: xRange = {
      inferiorLimit:getLimit(secondInequalities, "inferior"),
      superiorLimit: getLimit(secondInequalities, "superior"),
    };
    console.log(secondInequalitiesSolution)

    equality = firstInequalitiesSolution.inferiorLimit === secondInequalitiesSolution.inferiorLimit && firstInequalitiesSolution.superiorLimit === secondInequalitiesSolution.superiorLimit
  }

  return equality;
};
