import { mathjs } from "../mathjs";
import {  MathNode } from "mathjs";

const m: any = mathjs;

const operation = (signName:string) => {
    if (signName === 'larger'){
      return ">"
    } 
  
    return "≥"
  }

const breakInequalities = (compoundInequality: any) => {
    let firstInequality: MathNode;
    let secondInequality: MathNode;
  
    if(compoundInequality.conditionals?.length === 2 && compoundInequality.params?.length === 3 ){
      firstInequality = new m.OperatorNode(operation(compoundInequality.conditionals[0]),compoundInequality.conditionals[0],[compoundInequality.params[0],compoundInequality.params[1]] )
    }
  
    console.log(firstInequality, "first ine")
  };

export const compareCompoundInequations = (firstInequation:any, secondInequation:any ) => {
let equality: boolean = false;

//@ts-ignore
const result = firstInequation.conditionals.every((relation: string) =>
//@ts-ignore
secondInequation.conditionals.includes(relation)
);

if (!result) {
equality = false;
} else {
const firstInequalities = breakInequalities(firstInequation);
const secondInequalities = breakInequalities(secondInequation);
}

console.log(result, "result");

return equality;
}