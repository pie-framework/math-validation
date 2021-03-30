export default {
    mode: "literal",

    tests: [
        { target: "12.00", eq: ["12.000000"], literalOpts: { allowTrailingZeros: true } },
        { target: "12.00", ne: ["12.000000"], literalOpts: { allowTrailingZeros: false } },
        { target: "2 + 3", eq: ["3 + 2"], literalOpts: { ignoreOrder: true } },
        { target: "2 + 3", ne: ["3 + 2"], literalOpts: { ignoreOrder: false } },
        { target: "a+b+c", eq: ["c+a+b"], literalOpts: { ignoreOrder: true } },
        { target: "a+b+c", ne: ["c+a+b"], literalOpts: { ignoreOrder: false } },
        { target: "12.00+3", eq: ["3+12.00"], literalOpts: { allowTrailingZeros: true, ignoreOrder: true } }
    ],
};
