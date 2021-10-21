import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";
import {
  expressionsCanBeCompared,
  equationsHaveTheSameUnknowns,
  getUnknowns,
  transformEqualityInExpression,
  getCoefficients,
  solveLinearEquation,
} from "./utils";

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

// break 3-way inequality in two 2-way inequalities; input a > b > c, output a > b and b > c
const breakInequality = (compoundInequality: any): InequalitiesPairs => ({
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
});

export const getLimit = (
  expressionsPair: InequalitiesPairs,
  limitType: string
): number => {
  const expressionR = transformEqualityInExpression(
    expressionsPair.rightHandInequality
  );
  const expressionL = transformEqualityInExpression(
    expressionsPair.leftHandInequality
  );

  const xFirstInequality = solveLinearEquation(getCoefficients(expressionR));
  const xSecondInequality = solveLinearEquation(getCoefficients(expressionL));

  if (limitType === "inferior") {
    return Math.min(xFirstInequality, xSecondInequality);
  }

    return Math.max(xFirstInequality, xSecondInequality);
  
};

export const compareCompoundInequations = (
  firstInequation: any,
  secondInequation: any
) => {
  const result = firstInequation.conditionals.every(
    (relation: string) =>
      secondInequation.conditionals.includes(relation) &&
      firstInequation.conditionals?.length === 2 &&
      firstInequation.params?.length === 3 &&
      expressionsCanBeCompared(firstInequation, secondInequation)
  );

  if (!result) {
    return false;
  }

  const firstInequalityUnknownsName = getUnknowns(firstInequation);
  const secondInequalityUnknownsName = getUnknowns(secondInequation);

  if (
    !equationsHaveTheSameUnknowns(
      firstInequalityUnknownsName,
      secondInequalityUnknownsName
    ) &&
    firstInequalityUnknownsName?.length === 1
  ) {
    return false;
  }

  const firstInequalities = breakInequality(firstInequation);
  const secondInequalities = breakInequality(secondInequation);

  // find out interval for inequality solution; 
  // it does not matter whether we have an open, or half-open/half-close interval, the signs are already compared and at this point they match
  let firstInequalitiesSolution: xRange = {
    inferiorLimit: getLimit(firstInequalities, "inferior"),
    superiorLimit: getLimit(firstInequalities, "superior"),
  };

  let secondInequalitiesSolution: xRange = {
    inferiorLimit: getLimit(secondInequalities, "inferior"),
    superiorLimit: getLimit(secondInequalities, "superior"),
  };

  // if interval limits are the same for both inequalities then we can say that inequalities are equivalent
  return (
    firstInequalitiesSolution.inferiorLimit ===
      secondInequalitiesSolution.inferiorLimit &&
    firstInequalitiesSolution.superiorLimit ===
      secondInequalitiesSolution.superiorLimit
  );
};
