import { AstToMathJs } from "../conversion/ast-to-mathjs";
import { LatexToAst } from "../conversion/latex-to-ast";

import { splitInequality } from "../symbolic/compare-compound-inequations";

const lta = new LatexToAst();
const atm = new AstToMathJs();

describe("splitInequality", () => {
  it.each`
    compoundInequality        | leftPart         | rightPart
    ${"20>x>7"}               | ${"20>x"}        | ${"x>7"}
    ${" 5 ≥ -4 + x > -1 - 1"} | ${" 5 ≥ -4 + x"} | ${"-4 + x > -1 - 1"}
    ${"x/x<x+y≤1.5*2"}        | ${"x/x<x+y"}     | ${"x+y≤1.5*2"}
    ${"2 < 4x > 20"}          | ${"2<4x"}        | ${"4x>20"}
    ${"-3 < 2x+5 < 17"}       | ${"-3<2x+5"}     | ${"2x+5 < 17"}
    ${"-3 = 6x = -3"}         | ${"-3 = 6x"}     | ${"6x = -3"}
    ${"a≥b≥c "}               | ${"a≥b"}         | ${"b≥c"}
    ${"a+2≥b-10≥c-100 "}      | ${"a+2≥b-10"}    | ${"b-10≥c-100"}
    ${"a≠b≠c "}               | ${"a≠b"}         | ${"b≠c"}
  `(
    "$compoundInequality => $leftPart, $rightPart",
    ({ compoundInequality, leftPart, rightPart }) => {
      const inequality = atm.convert(lta.convert(compoundInequality));
      const broken = splitInequality(inequality);

      const leftSide = atm.convert(lta.convert(leftPart));
      const rightSide = atm.convert(lta.convert(rightPart));

      expect(broken.left).toEqual(leftSide);
      expect(broken.right).toEqual(rightSide);
    }
  );
});
