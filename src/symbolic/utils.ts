import { mathjs } from "../mathjs";
import { all, create, MathNode } from "mathjs";
import { simplify as customSimplify } from "./";
const { simplify } = mathjs;

const m: any = mathjs;

// plain floating-point instance for numeric checks; the shared instance works with fractions
const numeric: any = create(all);

let simplifyRules = [
  { l: "-((n1)*(n2))", r: "(n1)*(n2)" },
  { l: "(n1-n2)/n3", r: "n1/n3-n2/n3" },
  { l: "(n1+n2)/n3", r: "n1/n3+n2/n3" },
  { l: "(n1-n2)*n3/n4", r: "(n1*n3)/n4-(n2*n3)/n4" },
  { l: "(n1+n2)*n3/n4", r: "(n1*n3)/n4+(n2*n3)/n4" },
];

const customRound = (number: number) =>
  Math.round(number * 10000000000000) / 10000000000000;

// expressions can be compared if we have at least one symbol node and has no function node or array; do not treat math series as equations
export const expressionsCanBeCompared = (
  firstEquation: MathNode,
  secondEquation: MathNode
): boolean => {
  let noFunctionOrArray: boolean = true;
  let firstSymbolNode: boolean = false;
  let symbolNode: boolean = false;
  let seriesNode: boolean = false;

  firstEquation.traverse(function (node, path, parent) {
    if (node.isSymbolNode) {
      firstSymbolNode = true;
      seriesNode = seriesNode || node.name.includes("[");
    }
    noFunctionOrArray =
      noFunctionOrArray || node.isFunctionNode || node.isArrayNode;
  });

  secondEquation.traverse(function (node, path, parent) {
    if (node.isFunctionNode || node.isArrayNode) {
      noFunctionOrArray = false;
    }

    if (node.isSymbolNode && firstSymbolNode) symbolNode = true;
  });

  return noFunctionOrArray && symbolNode && !seriesNode;
};

export const hasSymbolicExponent = (node: MathNode): boolean => {
  let found = false;

  node.traverse((n) => {
    if (
      n.isOperatorNode &&
      n.op === "^" &&
      !n.args[1]?.isConstantNode // Exponent is symbolic or compound
    ) {
      found = true;
    }
  });

  return found;
};

// deterministic pseudo-random generator (mulberry32), so numeric checks give the same result on every run
const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// sample points where every variable gets its own non-integer value between 0.5 and 4.5,
// so that expressions like x^2 and y^2 can be told apart
export const getSamplePoints = (variables: string[], count: number = 8) => {
  const random = seededRandom(443);

  return Array.from({ length: count }, () =>
    variables.reduce((acc, v) => {
      acc[v] = 0.5 + 4 * random();
      return acc;
    }, {} as Record<string, number>)
  );
};

// evaluate an expression at each sample point; NaN where it can't be evaluated to a real number
const evaluateAtPoints = (expr: MathNode, points: Record<string, number>[]) => {
  let compiled: any;

  try {
    compiled = numeric.compile(expr.toString());
  } catch {
    return points.map(() => NaN);
  }

  return points.map((scope) => {
    try {
      const result = compiled.evaluate({ ...scope });
      return typeof result === "number" ? result : NaN;
    } catch {
      return NaN;
    }
  });
};

const areClose = (a: number, b: number, tolerance: number) =>
  Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));

export const areNumericallyEquivalent = (
  exprA: MathNode,
  exprB: MathNode,
  variables: string[],
  tolerance: number = 1e-10
): boolean => {
  const points = getSamplePoints(variables);
  const valuesA = evaluateAtPoints(exprA, points);
  const valuesB = evaluateAtPoints(exprB, points);

  return valuesA.every(
    (a, i) =>
      Number.isFinite(a) &&
      Number.isFinite(valuesB[i]) &&
      areClose(a, valuesB[i], tolerance)
  );
};

// exponent combinations for a factor such as x, 1/y or x*y^2, used when both sides of an equation were multiplied by variables
const getVariableFactors = (variables: string[], maxPower: number) =>
  variables.reduce(
    (factors, v) =>
      factors.reduce(
        (acc, factor) =>
          acc.concat(
            Array.from({ length: 2 * maxPower + 1 }, (_, i) => ({
              ...factor,
              [v]: i - maxPower,
            }))
          ),
        [] as Record<string, number>[]
      ),
    [{}] as Record<string, number>[]
  );

// two equations F = 0 and G = 0 describe the same solutions when F is a nonzero constant multiple of G;
// with allowVariableFactor, F may also be G multiplied by a power of each variable (e.g. both sides multiplied by x)
// set positiveOnly for inequalities, where multiplying by a negative number reverses the sign
export const areEquationsNumericallyEquivalent = (
  firstExpression: MathNode,
  secondExpression: MathNode,
  variables: string[],
  {
    allowVariableFactor = false,
    positiveOnly = false,
  }: { allowVariableFactor?: boolean; positiveOnly?: boolean } = {}
): boolean => {
  const tolerance = 1e-9;
  const points = getSamplePoints(variables);
  const firstValues = evaluateAtPoints(firstExpression, points);
  const secondValues = evaluateAtPoints(secondExpression, points);

  const ratios: { point: Record<string, number>; ratio: number }[] = [];

  for (let i = 0; i < points.length; i++) {
    const f = firstValues[i];
    const g = secondValues[i];

    if (!Number.isFinite(f) || !Number.isFinite(g)) {
      continue;
    }

    const fIsZero = Math.abs(f) < tolerance;
    const gIsZero = Math.abs(g) < tolerance;

    // the point lies on both curves
    if (fIsZero && gIsZero) {
      continue;
    }

    // the point lies on only one of the curves
    if (fIsZero || gIsZero) {
      return false;
    }

    ratios.push({ point: points[i], ratio: f / g });
  }

  // not enough points to decide
  if (ratios.length < 3) {
    return false;
  }

  const factors = allowVariableFactor
    ? getVariableFactors(variables, 2)
    : [{} as Record<string, number>];

  return factors.some((factor) => {
    const scaled = ratios.map(({ point, ratio }) =>
      Object.keys(factor).reduce(
        (acc, v) => acc / Math.pow(point[v], factor[v]),
        ratio
      )
    );

    return (
      (!positiveOnly || scaled[0] > 0) &&
      scaled.every((r) => areClose(r, scaled[0], tolerance))
    );
  });
};

// move the terms of the equations to the left hand side
export const transformEqualityInExpression = (equality: MathNode) =>
  // remove added/subtracted numbers/variables from both sides of the equation
  customSimplify(new m.OperatorNode("-", "subtract", equality.args));

// check if equation is valid and find out the number of variables and their name
export const getVariables = (equation: MathNode) => {
  let variableNames: string[] = [];

  equation.traverse(function (node, path, parent) {
    if (
      node.isSymbolNode &&
      node?.name.length === 1 &&
      !variableNames.includes(node.name)
    ) {
      variableNames.push(node.name);
    }
  });

  return variableNames.sort();
};

export const getCoefficients = (equation: MathNode, isInequality: boolean) => {
  // coefficients will be determined if equation has only one variable

  try {
    const rationalizedEquation = m.rationalize(equation, {}, true);

    let coefficients = rationalizedEquation.coefficients;
    let allNegatives = coefficients.every((coefficient) => coefficient < 0);

    return allNegatives
      ? coefficients.map((coefficient) => Math.abs(coefficient))
      : coefficients;
  } catch (e) {
    // rationalize may fail if variable is isolated in a fraction
    // we give it another try to rationalize after applying a new round of simplify to separate the variable
    if (isInequality) {
      equation = simplify(equation, simplifyRules);
    } else {
      simplifyRules.push({ l: "-(n)", r: "n" });
      equation = simplify(equation, simplifyRules);
    }

    try {
      const rationalizedEquation = m.rationalize(equation, {}, true);
      return rationalizedEquation.coefficients;
    } catch (e) {}
  }

  return [1, 0];
};

export const setXToOne = (equation: any, variableName: string) =>
  equation.transform(function (node, path, parent) {
    if (node.isSymbolNode && node.name === variableName) {
      return new m.ConstantNode(1);
    }

    return node;
  });

// quadratic equation solver for a second-order polynomial equation such as ax^2 + bx + c = 0 for x, where a is not zero
// quadratic formula
export const solveQuadraticEquation = (coefficients: number[]) => {
  const [c, b, a] = coefficients;
  const discriminant = b * b - 4 * a * c;

  let addDiscriminant: any;
  let subtractDiscriminant: any;

  try {
    addDiscriminant = m.compile(
      m.fraction(-b + m.sqrt(discriminant)) / (2 * a)
    );
  } catch {
    addDiscriminant = m.compile("(-b+sqrt(discriminant))/(2*a)");
  }

  try {
    subtractDiscriminant = m.compile(
      m.fraction(-b - m.sqrt(discriminant)) / (2 * a)
    );
  } catch {
    subtractDiscriminant = m.compile("(-b-sqrt(discriminant))/(2*a)");
  }

  let firstRoot = addDiscriminant.evaluate({
    discriminant: discriminant,
    a: a,
    b: b,
  });

  let secondRoot = subtractDiscriminant.evaluate({
    discriminant: discriminant,
    a: a,
    b: b,
  });

  // roots are real numbers
  if (!firstRoot.im) {
    firstRoot = customRound(firstRoot);
    secondRoot = customRound(secondRoot);
    return [
      { re: firstRoot, im: 0 },
      { re: secondRoot, im: 0 },
    ];
  }

  return [
    {
      re: customRound(firstRoot.re),
      im: customRound(firstRoot.im),
    },
    {
      re: customRound(secondRoot.re),
      im: customRound(secondRoot.im),
    },
  ];
};

// solve x
export const solveLinearEquation = (coefficients: number[]) => {
  let result: number;

  if (!coefficients) {
    return undefined;
  }

  if (coefficients.length === 3 && coefficients[0] === 0) {
    coefficients = coefficients.splice(1, 2);
  }

  if (coefficients.length === 2) {
    if (coefficients[0] === 0 && coefficients[1] === 0) {
      return Infinity;
    }

    if (coefficients[0] === 0) {
      return 0;
    }

    // equation with no solution : if coefficient for x is 0 => division by zero => result == -Infinity
    result = customRound(m.divide(coefficients[0], -1 * coefficients[1]));
  }

  return result;
};

export const equationsHaveTheSameVariables = (
  firstEquationVariables: string[],
  secondEquationVariables: string[]
) => {
  return (
    Array.isArray(firstEquationVariables) &&
    Array.isArray(secondEquationVariables) &&
    firstEquationVariables.length === secondEquationVariables.length &&
    firstEquationVariables.every(
      (variable, index) => variable === secondEquationVariables[index]
    )
  );
};
