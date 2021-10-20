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
  } else {
    return Math.max(xFirstInequality, xSecondInequality);
  }
};

export const compareCompoundInequations = (
  firstInequation: any,
  secondInequation: any
) => {
  let equality: boolean = false;

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

  let firstInequalitiesSolution: xRange = {
    inferiorLimit: getLimit(firstInequalities, "inferior"),
    superiorLimit: getLimit(firstInequalities, "superior"),
  };

  let secondInequalitiesSolution: xRange = {
    inferiorLimit: getLimit(secondInequalities, "inferior"),
    superiorLimit: getLimit(secondInequalities, "superior"),
  };

  return (
    firstInequalitiesSolution.inferiorLimit ===
      secondInequalitiesSolution.inferiorLimit &&
    firstInequalitiesSolution.superiorLimit ===
      secondInequalitiesSolution.superiorLimit
  );
};
