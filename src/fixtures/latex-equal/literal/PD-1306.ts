export default {
    mode: "literal",
    tests: [
        {
            target: "\\frac{5}{4}",
            eq: [],
            ne: ["1.25", "\\frac{10}{8}"],
        },
        {
            target: "\\frac{10}{2}",
            eq: [],
            ne: ["5", "\\frac{20}{4}"],
        },
        {
            target: "\\frac{2}{1}",
            eq: [],
            ne: ["2", "\\frac{4}{2}"],
        }
    ],
};
