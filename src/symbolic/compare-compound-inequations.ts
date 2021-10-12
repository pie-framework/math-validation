import { mathjs } from "../mathjs";
import { MathNode, number } from "mathjs";
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

  console.log(result, "x")
  return result
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
      firstInequation.params?.length === 3 && equationsCanBeCompared (firstInequation,secondInequation)
  );

  if (!result) {
    return false;
  } else {
    const firstInequalityUnknownsName = getUnknowns(firstInequation);
    const secondInequalityUnknownsName = getUnknowns(secondInequation);

    console.log(firstInequalityUnknownsName, secondInequalityUnknownsName)

    if (
      !equationsHaveTheSameUnknowns(
        firstInequalityUnknownsName,
        secondInequalityUnknownsName
      )
    ) {
      return false;
    }



    const firstInequalities = breakInequality(firstInequation);
    const secondInequalities = breakInequality(secondInequation);

    // console.log(firstInequalities, "firstInequalities");
    // console.log(secondInequalities, "secondInequalities");

    let firstInequalitiesSolution: xRange = {
      inferiorLimit: findX(firstInequalities.rightHandInequality),
      superiorLimit: findX(firstInequalities.leftHandInequality),
    };
    let secondInequalitiesSolution: xRange = {
      inferiorLimit: findX(secondInequalities.rightHandInequality),
      superiorLimit: findX(secondInequalities.leftHandInequality),
    };

    equality = firstInequalitiesSolution.inferiorLimit === secondInequalitiesSolution.inferiorLimit && firstInequalitiesSolution.superiorLimit === secondInequalitiesSolution.superiorLimit
  }

  return equality;
};
