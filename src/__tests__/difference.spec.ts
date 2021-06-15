import { LatexToAst } from "../conversion/latex-to-ast";
import { differenceIsTooGreat } from "../difference";

const lta = new LatexToAst();

describe("differenceIsToGreat", () => {
  it.each`
    a                                                                   | b                                                                                               | tooGreat
    ${"x"}                                                              | ${"x"}                                                                                          | ${false}
    ${"x"}                                                              | ${"((x^2 + x) / x) - 1"}                                                                        | ${false}
    ${"1 + 1"}                                                          | ${"abc * arst +  99 + b - defghijklmno + (1 * (2 ^ 3)) + pqrstuvwxyz 1  asin aosin cvbkyu isn"} | ${true}
    ${"\\frac{6\\pi}{x}\\text{radians}\\ \\text{per}\\ \\text{second}"} | ${"\\frac{1}{x}\\left(6\\pi \\right)\\ \\text{radians}\\ \\text{per}\\ \\text{second}"}         | ${false}
  `("$a | $b => $tooGreat", ({ a, b, tooGreat }) => {
    const al = lta.convert(a);
    const bl = lta.convert(b);
    expect(differenceIsTooGreat(al, bl)).toBe(tooGreat);
  });
});
