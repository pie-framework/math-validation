import { mathjs } from "../mathjs";
import { MathNode } from "mathjs";

const m: any = mathjs;

export type InequalitiesPairs = {
  leftHandInequality: MathNode;
  rightHandInequality: MathNode;
};

const operation = (signName: string) => {
  if (signName === "larger") {
    return ">";
  }

  console.log(signName, "signName");
  return "≥";
};

const breakInequality = (compoundInequality: any): InequalitiesPairs  => {
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
  }
};

export const compareCompoundInequations = (
  firstInequation: any,
  secondInequation: any
) => {
  let equality: boolean = false;

  const result = firstInequation.conditionals.every((relation: string) =>
    secondInequation.conditionals.includes(relation) && firstInequation.conditionals?.length === 2 &&
    firstInequation.params?.length === 3
  );

  if (!result) {
    equality = false;
  } else {
    const firstInequalities = breakInequality(firstInequation);
    const secondInequalities = breakInequality(secondInequation);

    console.log(firstInequalities, "firstInequalities")
    console.log(secondInequalities, "secondInequalities")
  }

  console.log(result, "result");

  return equality;
};
