import { mathjs } from "../mathjs";
import { MathNode, unequal } from "mathjs";
import {
  expressionsCanBeCompared,
  equationsHaveTheSameVariables,
  getVariables,
  transformEqualityInExpression,
  getCoefficients,
  solveLinearEquation,
} from "./utils";

const m: any = mathjs;

export type NodePair = {
  left: MathNode;
  right: MathNode;
};

export type Range = {
  min: number;
  max: number;
};

const operation = (signName: string) => {
  switch (signName) {
    case "smaller":
      return "<";
    case "smallerEq":
      return "<=";
    case "larger":
      return ">";
    case "largerEq":
      return ">=";
    case "equal":
      return "==";
    case "unequal":
      return "!=";
  }
};

// splitInequality takes in a RelationalNode with 2 conditionals and 3 params and returns 2 operatorNodes each containing a 2-way inequality
export const splitInequality = (compoundInequality: any): NodePair => ({
  left: new m.OperatorNode(
    operation(compoundInequality.conditionals[0]),
    compoundInequality.conditionals[0],
    [compoundInequality.params[0], compoundInequality.params[1]]
  ),
  right: new m.OperatorNode(
    operation(compoundInequality.conditionals[1]),
    compoundInequality.conditionals[1],
    [compoundInequality.params[1], compoundInequality.params[2]]
  ),
});

// get interval inferior/superior limits
export const getLimit = (
  expressionsPair: NodePair,
  limitType: string
): number => {
  const expressionR = transformEqualityInExpression(expressionsPair.right);
  const expressionL = transformEqualityInExpression(expressionsPair.left);

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


  if (!expressionsCanBeCompared(firstInequation, secondInequation)) {
    return false;
  }

  const firstInequalityVariablesName = getVariables(firstInequation);
  const secondInequalityVariablesName = getVariables(secondInequation);

  if (
    !equationsHaveTheSameVariables(
      firstInequalityVariablesName,
      secondInequalityVariablesName
    ) &&
    firstInequalityVariablesName?.length === 1
  ) {
    return false;
  }

  const firstInequalities = splitInequality(firstInequation);
  const secondInequalities = splitInequality(secondInequation);

  // find out interval for inequality solution;
  // it does not matter whether we have an open, or half-open/half-close interval, the signs are already compared and at this point they match
  let firstInequalitiesSolution: Range = {
    min: getLimit(firstInequalities, "inferior"),
    max: getLimit(firstInequalities, "superior"),
  };

  let secondInequalitiesSolution: Range = {
    min: getLimit(secondInequalities, "inferior"),
    max: getLimit(secondInequalities, "superior"),
  };

  // if interval limits are the same for both inequalities then we can say that inequalities are equivalent
  return (
    firstInequalitiesSolution.min === secondInequalitiesSolution.min &&
    firstInequalitiesSolution.max === secondInequalitiesSolution.max
  );
};
