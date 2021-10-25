import { AstToMathJs } from "../conversion/ast-to-mathjs";
import { LatexToAst } from "../conversion/latex-to-ast";

import { splitInequality } from "../symbolic/compare-compound-inequations";

const lta = new LatexToAst();
const atm = new AstToMathJs();

describe("splitInequality", () => {
  it.each`
    compoundInequality | leftPart  | rightPart
    ${"20>x>7"}        | ${"20>x"} | ${"x>7"}
    ${" 5 ≥ -4 + x > -1 - 1"}        | ${" 5 ≥ -4 + x"} | ${"-4 + x > -1 - 1"}
    ${"x/x<x+y≤1.5*2"}        | ${"x/x<x+y"} | ${"x+y≤1.5*2"}
    ${ "2 < 4x > 20"}        | ${"2<4x"} | ${"4x>20"}
  `(
    "$compoundInequality => $leftPart, $rightPart",
    ({ compoundInequality, leftPart, rightPart }) => {
      const equation = atm.convert(lta.convert(compoundInequality));
      const broken = splitInequality(equation);

      const leftPartExpression = atm.convert(lta.convert(leftPart));
      const rightPartExpression = atm.convert(lta.convert(rightPart));

      expect(broken.left).toEqual(leftPartExpression);
      expect(broken.right).toEqual(rightPartExpression);
    }
  );
});
