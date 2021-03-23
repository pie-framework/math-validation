const mathjs = require("mathjs");

// const o = mathjs.derivative("2x + y + z^3", "y", { simplify: false });

// console.log("o:", o, o.toString());

// const p = mathjs.parser();

// p.set("x", 1);
// p.set("y", 2);
// p.set("z", 3);
// p.evaluate("2x + y + z");

// const xv = p.get("x");
// const all = p.getAll();

// const getSymbols = (n) => {
//   const symbols = [];
//   n.traverse((node, path, parent) => {
//     if (node.isSymbolNode && !symbols.includes(node.name)) {
//       symbols.push(node.name);
//     }
//   });
//   return symbols;
// };

// const ss = getSymbols(mathjs.parse("2x +y + (z / (3/n))"));
// console.log("ss:", ss);
// console.log("xv:", xv);
// console.log("all:", all);

// const one = "(b + d) / 2 * z + (a + c) / 2";
// const two = "(d+b) / 2 * z + (a +c) / 2";
// const one = "(b + d) / 2"; // * z + (a + c) / 2";
// const two = "(d+b) / 2"; // * z + (a +c) / 2";
const one = "(b+d) + a"; // * z + (a + c) / 2";
const two = "y + (d+b)"; // * z + (a +c) / 2";

const om = mathjs.parse(one);
const tm = mathjs.parse(two);

console.log("om:", om);

const transformed = om.transform((n, path, parent) => {
  console.log("n:", n.toString());
  return n;
});

const compareNodes = (a, b) => {
  if (a.type === b.type) {
    if (a.type === "ConstantNode") {
      return String(a.name).localeCompare(b.name);
    }
  }
  return 0;
};
// om.cloneDeep()
const sort = (n) => {
  console.log(JSON.stringify(n, null, "  "));

  if (n.type === "OperatorNode" && n.fn === "add") {
    // [].sort()
    n.args = n.args.sort(compareNodes);
    console.log("n args:", n.args);
    // .((a) => sort(a));
    return n;
  } else if (n.type === "ParenthesisNode") {
    n.content = sort(n.content);
    return n;
  } else if (n.type === "ConstantNode") {
    return n;
  }
  if (n && n.fn === "add") {
    n.args = n.args.map((a) => sort(a));
    return n;
  } else {
    return n;
  }
  return n;
};

const sorted = sort(om);
console.log("sorted:", sorted.toString());
// console.log("transformed:", transformed.toString());
// const sortA

// console.log("plain:", om.equals(tm));
// console.log("plain:", mathjs.simplify(om).equals(mathjs.simplify(tm)));
// console.log("plain:", mathjs.rationalize(om).equals(mathjs.rationalize(tm)));

// const equal = mathjs
//   .parse(mathjs.simplify(one))
//   .equals(mathjs.parse(mathjs.simplify(two)));
// console.log("?", equal);
