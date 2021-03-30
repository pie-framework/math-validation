import {isMathEqual} from '../literal';
import {LatexToAst} from "../conversion/latex-to-ast";
import {AstToMathJs} from "../conversion/ast-to-mathjs";

describe('opts', () => {
    let lta, atm, toMathNode;

    beforeEach(() => {
        lta = new LatexToAst();
        atm = new AstToMathJs();
        toMathNode = (latex: string) => {
            const ast = lta.convert(latex);
            return atm.convert(ast);
        }
    })

    it.each`
    a            | b              | opts                                               | expected
    ${'12.00'}   | ${'12.000000'} | ${{ allowTrailingZeros: true }}                    | ${true}
    ${'12.00'}   | ${'12.000000'} | ${{ allowTrailingZeros: false }}                   | ${false}
    ${'2 + 3'}   | ${'3 + 2'}     | ${{ ignoreOrder: true }}                           | ${true}
    ${'2 + 3'}   | ${'3 + 2'}     | ${{ ignoreOrder: false }}                          | ${false}
    ${'a+b+c'}   | ${'c+a+b'}     | ${{ ignoreOrder: true }}                           | ${true}
    ${'a+b+c'}   | ${'c+a+b'}     | ${{ ignoreOrder: false }}                          | ${false}
    ${'1.200+3'} | ${'3+12'}      | ${{ ignoreOrder: true, allowTrailingZeros: true}}  | ${true}
    ${'1.200+3'} | ${'3+12'}      | ${{ ignoreOrder: false, allowTrailingZeros: true}} | ${false}

    `('isMathEqual($a, $b) returns $expected for $opts', ({a, b, expected, opts}) => {
        expect(isMathEqual(toMathNode(a), toMathNode(b), opts)).toEqual(expected);
    })
})
