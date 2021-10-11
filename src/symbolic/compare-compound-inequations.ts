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

const breakInequality = (compoundInequality: any) => {
  let inequalities: InequalitiesPairs;

   inequalities= {
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

  console.log(compoundInequality.conditionals, "conditionals");

  console.log(
    inequalities.leftHandInequality,
    inequalities.rightHandInequality,
    "first inequality"
  );

  return inequalities;
};

export const compareCompoundInequations = (
  firstInequation: any,
  secondInequation: any
) => {
  let equality: boolean = false;

  //@ts-ignore
  const result = firstInequation.conditionals.every((relation: string) =>
    //@ts-ignore
    secondInequation.conditionals.includes(relation)
  );

  if (!result) {
    equality = false;
  } else if (
    firstInequation.conditionals?.length === 2 &&
    firstInequation.params?.length === 3
  ) {
    const firstInequalities = breakInequality(firstInequation);
    const secondInequalities = breakInequality(secondInequation);
  }

  console.log(result, "result");

  return equality;
};
