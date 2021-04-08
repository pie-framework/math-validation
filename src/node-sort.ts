import { MathNode, simplify } from "mathjs";

/**
 * The plan with node sort was to sort all the nodes in an expression where possible
 * This means any commutative operators aka + and *.
 *
 * With symbols sorted - we shoud be able to call `node.equals(other)` and avoid having to call evaluate.
 */

const _f = (op: string) => (acc: any[], param: any): any => {
  if (Array.isArray(param)) {
    if (param[0] === op) {
      param.shift();
      return param.reduce(_f(op), acc);
      // const out = acc.concat(param);
      // console.log("OUT:", out);
      // return out;
    } else {
      acc.push(param);
      return acc;
    }
  } else {
    acc.push(param);
    return acc;
  }
};

const reducer = (acc: any[], value: any): any => {
  console.log("acc:", acc);
  if (acc.length === 0) {
    acc.push(value);
    return acc;
  } else if (Array.isArray(value)) {
  } else {
    return acc;
  }
};

export const flatten = (tree: any[]): any[] => {
  // const op = tree.shift();
  // console.log("op", op);
  return tree.reduce(reducer, []);
  // (acc, value) => {
  //   if (Array.isArray(value)) {
  //   }
  // }, []);

  // const params = tree.reduce((acc, value) => {
  //   if (Array.isArray(value)) {
  //   }
  // }, []);
  // console.log("params", params);
  // return [op, ...params]; //.flat(100);

  // console.log("tree now:", tree);
  // const mapped = tree.map((v) => {
  //   if (Array.isArray(v)) {
  //     if (v[0] === op) {
  //       v.shift();
  //       console.log("v now:", v);
  //       return [...v];
  //     } else {
  //       return [v];
  //     }
  //   } else {
  //     return v;
  //   }
  // });
  // return [op, ...mapped.flat()];
};

const compareNodes = (a: MathNode, b: MathNode): number => {
  // console.log(
  //   "[compareNodes]: a '",
  //   a.toString(),
  //   "', b: '",
  //   b.toString(),
  //   "'"
  // );
  if (a.type === "SymbolNode" && b.type === "SymbolNode") {
    // console.log(a.name, "> ", b.name);
    return a.name.localeCompare(b.name);
  }

  return a.toString().localeCompare(b.toString());
  // if (a.isSymbolNode && b.isOperatorNode) {
  //   return 1;
  // }
  // if (b.isSymbolNode && a.isOperatorNode) {
  //   return -1;
  // }

  // if (a.isOperatorNode) {
  //   return 1;
  // }
  // if (b.isOperatorNode) {
  //   return -1;
  // }
  // return 0;
};

export const sortRelational = (node: any) => {
  console.log("THIS IS THE START ++++",JSON.stringify(node))

    node.traverse((node, path, parent) => {

      let reverse = false;
      if (node.conditionals) {
        node.conditionals = node.conditionals.map((cond: any) => {
          if (cond === "larger") {
            reverse = true
            return "smaller";
          }

          return cond;
        });
      }

      if (node.params && reverse) {
        node.params.reverse();
      }

      // console.log("node++++", JSON.stringify(node), parent && parent.type, " ?????????") //,"path", JSON.stringify(path), "parrent",JSON.stringify(parent))

      if (parent && parent.type === "RelationalNode") {
        node = customSort(node);
      }
    });

  console.log("THIS IS THE END ++++",JSON.stringify(node))
  return node;

};

export const customSort = (node: MathNode): MathNode => {
  // console.log("[sort] :", JSON.stringify(node, null, "  "));
  console.log(node,"node")

  if (node.isParenthesisNode) {
    node.content = customSort(node.content);
    // console.log("[1 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

   if (node.type === "OperatorNode" && (node.fn === "add" || node.fn === "multiply" )) {
    node.args = node.args.map(sort);

    node.args.sort(compareNodes);
   console.log("[2 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }
  if (node.type === "OperatorNode" && node.fn === "multiply") {
    node.args = node.args.map(sort);

    node.args.sort(compareNodes);
   console.log("[2 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

    if (node.type === "OperatorNode" && node.fn === "smaller") {
    //let mirror = new mathjs.OperatorNode('>', 'larger', node.args)
      node.op = '>'
      node.fn = "larger"
      const temp = node.args[0]
      node.args[0] = node.args[1]
      node.args[1] = temp;


      node.args = node.args.map(customSort);
        // console.log("[3 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

  return node;
};

export const sort = (node: any) => {
  if (node.type === "RelationalNode") {

    return sortRelational(node)
  }

  return simplify(customSort(node))
}
