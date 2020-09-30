import { AstToMathJs } from "../src/new/ast-to-mathjs";
import { LatexToAst } from "../src/new/latex-to-ast";
import * as mathjs from "mathjs";

const e = "\\frac{x^2}{x}";
// const node = mathjs.parse(e);
// const o = mathjs.simplify(
//   node
//   // (mathjs.simplify as any).rules.concat([{ l: "(n1^2)/n1", r: "n1" }])
// );
// console.log("node simplified:", o);

const lta = new LatexToAst();
const atm = new AstToMathJs();
const latexToMjs = (s) => {
  const ast = lta.convert(s);
  console.log(">>>>>>>>>>>> ast:", ast);
  return atm.convert(ast);
};

// // console.log("mjs JSON:", JSON.stringify(node, null, "  "))
// // console.log("me JSON:", JSON.stringify(mem, null, "  "));

// // console.log('converted:', converted, mathjs.simplify(converted));

// // const json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false}'
// // const x = JSON.parse(json, reviver)   // Unit 5 cm

const evaluate = (ms: string, ...values: number[]) => {
  const n = mathjs.parse(ms);

  values.forEach((v) => {
    console.log(ms, v, n.evaluate({ x: v }));
  });
};

const p = mathjs.parser();

// const pe = p.evaluate("x/2");
// console.log("e:", pe);

const expr = "y * x/2 + ac/ y";
const n = mathjs.parse("y * x/2 + ac/ y");

const symbols = [];
n.traverse((node, path, parent) => {
  if (node.isSymbolNode && !symbols.includes(node.name)) {
    symbols.push(node.name);
  }
});

console.log(symbols);

symbols.forEach((s) => {
  console.log("set values for ", s);
  p.set(s, 1);
});
const result = p.evaluate(expr);
console.log("result:", result);

const testExpr = (s: string) => {
  const node = latexToMjs(s);
  console.log("node: ", node);
  const si = mathjs.simplify(node);
  console.log("s:", si);
};
// // console.log('x:', x)
// const testExpression = (e) => {
//   // console.log('expression:', e);

//   const node = mathjs.parse(e);
//   console.log("MATHJS NODE:", node);

//   // const c = new me.converters.latexToMathjsObj();

//   const men = latexToMjs(e);
//   console.log("ME NODE:", men);
//   // const reParsed = mathjs.json(men);
//   // console.log('mathjs.json:', mathjs)
//   // const n = JSON.stringify(node, replacer);
//   // console.log("s:", n);
//   // const reParsed = JSON.parse(n, reviver)   // Unit 5 cm
//   // console.log('re-parsed:', reParsed);

//   // const differences = diff(node, reParsed);
//   //  console.log(differences)
//   // console.log("mjs node:", node)
//   // console.log("re parsed:", reParsed);

//   console.log("simplified:", mathjs.simplify(node));
//   console.log("simplified:", mathjs.simplify(men));
//   // console.log('rp simplified:', mathjs.simplify(reParsed))
//   // console.log("MATHJS NODE from ME:", JSON.stringify(men, null, "  "));

//   // console.log('equal?', _.isEqual(node, men));

//   // const differences = diff(node, men);

//   // console.log(differences)

//   // console.log("NODE SIMPLIFIED:", mathjs.simplify(node))
//   // console.log("ME NODE SIMPLIFIED:", mathjs.simplify(men))
//   // console.log("reparsed NODE SIMPLIFIED:", mathjs.simplify(reParsed))
//   // const o = mathjs.simplify(node);
//   // console.log('node simplified:', o);
// };

// testExpr("x^2/x");

// evaluate("(x + 2) ^ 2", 2, 5, 10, 11, 12, 0.5);
// evaluate("(x^2) + 4(x+1)", 2, 5, 10, 11, 12, 0.5);
