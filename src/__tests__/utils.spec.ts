import { AstToMathJs } from "../conversion/ast-to-mathjs";
import { LatexToAst } from "../conversion/latex-to-ast";
import { simplify } from "../symbolic";

import {
  getVariables,
  getCoefficients,
  setXToOne,
  solveLinearEquation,
  solveQuadraticEquation,
  expressionsCanBeCompared,
  transformEqualityInExpression,
  getSamplePoints,
  areNumericallyEquivalent,
  areEquationsNumericallyEquivalent,
} from "../symbolic/utils";

const lta = new LatexToAst();
const atm = new AstToMathJs();

describe("expressionsCanBeCompared", () => {
  it('equations: "x = x" and "2=2" - should return false: equations can not be compared because second equation does not have a variable', () => {
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

  it('equations: "5z = 0" and "2y+3=m" - should return true: both equations have variables and does not contain functions', () => {
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

describe("getVariables", () => {
  it.each`
    expression               | variables
    ${"x"}                   | ${["x"]}
    ${"x +1"}                | ${["x"]}
    ${"((x^2 + x) / x) - 1"} | ${["x"]}
    ${"1+2"}                 | ${[]}
    ${"a +1+c"}              | ${["a", "c"]}
    ${"((y^2 + z) / x) - 1"} | ${["x", "y", "z"]}
    ${"109h"}                | ${["h"]}
    ${"m+n+10"}              | ${["m", "n"]}
  `("$expression => $variables", ({ expression, variables }) => {
    const equation = atm.convert(lta.convert(expression));
    const variablesName = getVariables(equation);

    expect(variablesName).toEqual(variables);
  });
});

describe("getCoefficients", () => {
  it.each`
    expression                     | coefficients
    ${"x+0"}                       | ${[0, 1]}
    ${"2x^2 = 2x"}                 | ${[1, 0]}
    ${"x +1"}                      | ${[1, 1]}
    ${"((x^2 + x) / x) - 1"}       | ${[0, 0, 1]}
    ${"1+2"}                       | ${[]}
    ${"a +1+c"}                    | ${[]}
    ${"y^2+5y - 1"}                | ${[-1, 5, 1]}
    ${"2y^2+4y"}                   | ${[0, 4, 2]}
    ${"109h"}                      | ${[0, 109]}
    ${"m+n+10"}                    | ${[]}
    ${"x-x"}                       | ${[0, 0]}
    ${"x + 5 - 3 + x - 6 - x + 2"} | ${[-2, 1]}
    ${"2x-x"}                      | ${[0, 1]}
    ${"x - x - 2"}                 | ${[]}
  `("$expression => $coefficients", ({ expression, coefficients }) => {
    const equation = atm.convert(lta.convert(expression));
    const coefficientsList = getCoefficients(equation, false);

    expect(coefficientsList).toEqual(coefficients);
  });
});

describe("getCoefficients", () => {
  it('equation: "x = x" - has coefficients [0, 0]', () => {
    const equation = atm.convert(lta.convert("x-x"));
    const coefficientsList = getCoefficients(equation, false);

    expect(coefficientsList).toEqual([0, 0]);
  });

  it('equation: "1 = -2" - if equation has no coefficient for x but can be rationalized it will return an empty array', () => {
    const equation = atm.convert(lta.convert("1+2"));
    const coefficientsList = getCoefficients(equation, false);

    expect(coefficientsList).toEqual([]);
  });

  it('equation: "m + n = - 2" - if equation has more than one variable, will return coefficients [1, 0]', () => {
    const equation = atm.convert(lta.convert("m+n = - 2"));
    const coefficientsList = getCoefficients(equation, false);

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

describe("solveQuadraticEquation", () => {
  it.each`
    coefficients   | roots
    ${[14, -9, 1]} | ${[{ re: 7, im: 0 }, { re: 2, im: 0 }]}
    ${[-3, 2, 8]}  | ${[{ re: 0.5, im: 0 }, { re: -0.75, im: 0 }]}
    ${[8, 6, 2]}   | ${[{ re: -1.5, im:  1.3228756555323 }, { re: -1.5, im: -1.3228756555323 }]}
    ${[6, 5, 1]}   | ${[{ re: -2, im: 0 }, { re: -3, im: 0 }]}
    ${[3, -7, 2]}  | ${[{ re: 3, im: 0 }, { re: 1/2, im: 0 }]}
    ${[1, 3, 2]}   | ${[{ re: -0.5, im: 0 }, { re: -1, im: 0 }]}
    ${[-3, 2, 1]}  | ${[{ re: 1, im: 0 }, { re: -3, im: 0 }]}
    ${[-9, 0, 1]}  | ${[{ re: 3, im: 0 }, { re: -3, im: 0 }]}
    ${[-8, -5, 3]} | ${[{ re: 2.6666666666667, im: 0 }, { re: -1, im: 0 }]}
    ${[17, -5, 4]} | ${[{ re: 0.625, im: 1.9645292056877 }, { re: 0.625, im: -1.9645292056877}]}
  `("$coefficients => $roots", ({ coefficients, roots }) => {
    const result = solveQuadraticEquation(coefficients);
    
    expect(result).toEqual(roots);
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

describe("getSamplePoints", () => {
  it("gives each variable its own non-integer value, the same on every call", () => {
    const points = getSamplePoints(["x", "y"]);

    points.forEach((point) => {
      expect(point.x).not.toEqual(point.y);
      expect(Number.isInteger(point.x)).toEqual(false);
      expect(Number.isInteger(point.y)).toEqual(false);
    });

    expect(getSamplePoints(["x", "y"])).toEqual(points);
  });
});

describe("areNumericallyEquivalent", () => {
  it('"x^2" and "y^2" are not equivalent', () => {
    const a = atm.convert(lta.convert("x^2"));
    const b = atm.convert(lta.convert("y^2"));

    expect(areNumericallyEquivalent(a, b, ["x", "y"])).toEqual(false);
  });

  it('"(x+y)^2" and "x^2+2xy+y^2" are equivalent', () => {
    const a = atm.convert(lta.convert("(x+y)^2"));
    const b = atm.convert(lta.convert("x^2+2xy+y^2"));

    expect(areNumericallyEquivalent(a, b, ["x", "y"])).toEqual(true);
  });
});

describe("areEquationsNumericallyEquivalent", () => {
  const expression = (latex: string) =>
    transformEqualityInExpression(atm.convert(lta.convert(latex)));

  it('"x^2/16+y^2/9=1" and "9x^2+16y^2=144" are equivalent: one is a constant multiple of the other', () => {
    const result = areEquationsNumericallyEquivalent(
      expression("\\frac{x^2}{16}+\\frac{y^2}{9}=1"),
      expression("9x^2+16y^2=144"),
      ["x", "y"]
    );

    expect(result).toEqual(true);
  });

  it('"x^2/16+y^2/9=1" and "x^2/17+y^2/9=1" are not equivalent', () => {
    const result = areEquationsNumericallyEquivalent(
      expression("\\frac{x^2}{16}+\\frac{y^2}{9}=1"),
      expression("\\frac{x^2}{17}+\\frac{y^2}{9}=1"),
      ["x", "y"]
    );

    expect(result).toEqual(false);
  });

  it('"x+2y=7" and "x^2+2xy-7x=0" are equivalent only when a variable factor is allowed', () => {
    const first = expression("x+2y=7");
    const second = expression("x^2+2xy-7x=0");

    expect(areEquationsNumericallyEquivalent(first, second, ["x", "y"])).toEqual(
      false
    );
    expect(
      areEquationsNumericallyEquivalent(first, second, ["x", "y"], {
        allowVariableFactor: true,
      })
    ).toEqual(true);
  });
});
