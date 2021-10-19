import { AstToMathJs } from "../conversion/ast-to-mathjs";
import { LatexToAst } from "../conversion/latex-to-ast";
import { simplify } from "../symbolic";

import {
  getUnknowns,
  getCoefficients,
  setXToOne,
  solveLinearEquation,
  expressionsCanBeCompared,
  transformEqualityInExpression,
  findX,
} from "../symbolic/utils";

const lta = new LatexToAst();
const atm = new AstToMathJs();

describe("expressionsCanBeCompared", () => {
  it('equations: "x = x" and "2=2" - should return false: equations can not be compared because second equation does not have an unknown', () => {
    const firstEquation = atm.convert(lta.convert("x=x"));
    const secondEquation = atm.convert(lta.convert("2=2"));
    const result = expressionsCanBeCompared(firstEquation, secondEquation);

    expect(result).toEqual(false);
  });

  it('equations: "x = x" and "\\log x=2" - should return false: equations can not be compared because second equation contains a function', () => {
    const firstEquation = atm.convert(lta.convert("x=x"));
    const secondEquation = atm.convert(lta.convert("\\log x=2"));
    const result = expressionsCanBeCompared(firstEquation, secondEquation);

    expect(result).toEqual(false);
  });

  it('equations: "5z = 0" and "2y+3=m" - should return true: both equations have unknowns and does not contain functions', () => {
    const firstEquation = atm.convert(lta.convert("x=x"));
    const secondEquation = atm.convert(lta.convert("2y+3=m"));
    const result = expressionsCanBeCompared(firstEquation, secondEquation);

    expect(result).toEqual(true);
  });

  it('equations: "x" and "y" - should return true: both expressions have variables and does not contain functions', () => {
    const firstEquation = atm.convert(lta.convert("x"));
    const secondEquation = atm.convert(lta.convert("y"));
    const result = expressionsCanBeCompared(firstEquation, secondEquation);

    expect(result).toEqual(true);
  });
});

describe("transformEqualityInExpression", () => {
  it.each`
    equation             | transformedExpression
    ${"x+5= 2x+3"}       | ${"2-x"}
    ${"5-2(3-m)= 4m+10"} | ${"-5-4m-2(3-m)"}
    ${"a=2b+3"}          | ${"a-2b-3"}
  `(
    "$equation => $transformedExpression",
    ({ equation, transformedExpression }) => {
      const equationToTransform = atm.convert(lta.convert(equation));
      const expression = simplify(
        atm.convert(lta.convert(transformedExpression))
      );

      const result = transformEqualityInExpression(equationToTransform);

      expect(result.equals(expression)).toEqual(true);
    }
  );
});

describe("getUnknowns", () => {
  it.each`
    expression               | unknowns
    ${"x"}                   | ${["x"]}
    ${"x +1"}                | ${["x"]}
    ${"((x^2 + x) / x) - 1"} | ${["x"]}
    ${"1+2"}                 | ${[]}
    ${"a +1+c"}              | ${["a", "c"]}
    ${"((y^2 + z) / x) - 1"} | ${["x", "y", "z"]}
    ${"109h"}                | ${["h"]}
    ${"m+n+10"}              | ${["m", "n"]}
  `("$expression => $unknowns", ({ expression, unknowns }) => {
    const equation = atm.convert(lta.convert(expression));
    const unknownsName = getUnknowns(equation);

    expect(unknownsName).toEqual(unknowns);
  });
});

describe("getCoefficients", () => {
  it.each`
    expression                     | coefficients
    ${"x+0"}                       | ${[0, 1]}
    ${"2x^2 = 2x"}                      | ${[1, 0]}
    ${"x +1"}                      | ${[1, 1]}
    ${"((x^2 + x) / x) - 1"}       | ${[0, 0, 1]}
    ${"1+2"}                       | ${[1, 0]}
    ${"a +1+c"}                    | ${[1, 0]}
    ${"y^2+5y - 1"}                | ${[-1, 5, 1]}
    ${"2y^2+4y"}                   | ${[0, 4, 2]}
    ${"109h"}                      | ${[0, 109]}
    ${"m+n+10"}                    | ${[1, 0]}
    ${"x-x"}                       | ${[0, 0]}
    ${"x + 5 - 3 + x - 6 - x + 2"} | ${[-2, 1]}
    ${"2x-x"}                      | ${[0, 1]}
    ${"x - x - 2"}                 | ${[1, 0]}
  `("$expression => $coefficients", ({ expression, coefficients }) => {
    const equation = atm.convert(lta.convert(expression));
    const coefficientsList = getCoefficients(equation);

    expect(coefficientsList).toEqual(coefficients);
  });
});

describe("getCoefficients", () => {
  it('equation: "x = x" - has coefficients [0, 0]', () => {
    const equation = atm.convert(lta.convert("x-x"));
    const coefficientsList = getCoefficients(equation);

    expect(coefficientsList).toEqual([0, 0]);
  });

  it('equation: "1 = -2" - if equation has no coefficient for x it will return coefficients [1, 0]', () => {
    const equation = atm.convert(lta.convert("1+2"));
    const coefficientsList = getCoefficients(equation);

    expect(coefficientsList).toEqual([1, 0]);
  });

  it('equation: "m + n = - 2" - if equation has more than one variable, will return coefficients [1, 0]', () => {
    const equation = atm.convert(lta.convert("m+n = - 2"));
    const coefficientsList = getCoefficients(equation);

    expect(coefficientsList).toEqual([1, 0]);
  });
});

describe("setXToOne", () => {
  it.each`
    expression               | expressionNoX
    ${"x+0"}                 | ${"1+0"}
    ${"x +1"}                | ${"1+1"}
    ${"((x^2 + x) / x) - 1"} | ${"((1^2 + 1) / 1) - 1"}
    ${"1+2"}                 | ${"1+2"}
    ${"a +1+c"}              | ${"a+1+c"}
    ${"y^2+5x - 1"}          | ${"y^2+5*1 - 1"}
    ${"109h"}                | ${"109h"}
    ${"m+n+10"}              | ${"m+n+10"}
  `("$expression => $expressionNoX", ({ expression, expressionNoX }) => {
    const equation = atm.convert(lta.convert(expression));
    const equationNoX = setXToOne(equation, "x");
    const result = atm.convert(lta.convert(expressionNoX));

    expect(equationNoX.toTex()).toEqual(result.toTex());
  });
});

describe("solveLinearEquation", () => {
  it.each`
    coefficients  | xValue
    ${[0, 1]}     | ${0}
    ${[1, 1]}     | ${-1}
    ${[0, 0, 1]}  | ${0}
    ${[]}         | ${undefined}
    ${[-1, 5, 1]} | ${undefined}
    ${[0, 109]}   | ${0}
  `("$coefficients => $xValue", ({ coefficients, xValue }) => {
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(xValue);
  });
});

describe("solveLinearEquation", () => {
  it('equation: "x = x" - has infinite solutions', () => {
    const coefficients = [0, 0];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(Infinity);
  });

  it('equation: "x + 5 - 3 + x = 6 + x - 2" - solution should be 2', () => {
    const coefficients = [-2, 1];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(2);
  });

  it('equation: "2x = x" - solution should be 0', () => {
    const coefficients = [0, 1];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(0);
  });

  it('equation: "x = x + 2" - if equation has no solution it will return - Infinity', () => {
    const coefficients = [2, 0];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(-Infinity);
  });

  it('equation: "3x - 2x  = x + 7 + 9" - if equation has no solution it will return - Infinity', () => {
    const coefficients = [16, 0];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(-Infinity);
  });

  it('equation: "2y^2+4y" - solution is -2', () => {
    const coefficients = [0, 4, 2];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(-2);
  });

  it('equation: "2x^2 = 2x" - solution is 1', () => {
    const coefficients = [1, 0];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(1);
  });

  it('equation: "y^2+5y - 1" - if equation is quadratic, result is undefined', () => {
    const coefficients = [-1, 5, 1];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(undefined);
  });

  it('equation: "y^2+5y + 1" - if equation is quadratic, result is undefined', () => {
    const coefficients = [1, 5, 1];
    const result = solveLinearEquation(coefficients);

    expect(result).toEqual(undefined);
  });
});

describe("findX", () => {
  it.each`
    equation                       | unknownValue
    ${"x = x"}                     | ${Infinity}
    ${"x + 5 - 3 + x = 6 + x - 2"} | ${2}
    ${"2x = x"}                    | ${0}
    ${"x = x + 2"}                 | ${undefined}
    ${"3x - 2x  = x + 7 + 9"}      | ${undefined}
    ${"2x^2 = 2x"}                 | ${1}
    ${"y^2+5y - 1 = 0"}                | ${undefined}
    ${"y^2+5y + 1 =0 "}                | ${undefined}
    ${"2y^2+4y = 0"}                | ${-2}
  `("$equation => $unknownValue", ({ equation, unknownValue }) => {
    const nodeEquation = atm.convert(lta.convert(equation));
    const result = findX(nodeEquation);

    expect(result).toEqual(unknownValue);
  });
});
