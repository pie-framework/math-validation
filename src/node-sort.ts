import { MathNode } from "./mathjs";

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

export const sortRelational = (node) => {
  console.log("THIS IS THE START ++++",JSON.stringify(node))

  if (node.type === "RelationalNode") {
    node.traverse((node, path, parent) => {
      if (node.conditionals) {
        node.conditionals = node.conditionals.map((cond: any) => {
          if (cond === "larger") {
            return "smaller";
          }

          return cond;
        });
      }

      if (node.params) {
        node.params.reverse();
      }

      // console.log("node++++", JSON.stringify(node), parent && parent.type, " ?????????") //,"path", JSON.stringify(path), "parrent",JSON.stringify(parent))

      if (parent && parent.type === "RelationalNode") {
        node = sort(node);
      }
    });
  }

  console.log("THIS IS THE END ++++",JSON.stringify(node))
  return node;

    // node.conditionals[0]="smaller"
    // node.traverse(sign => {
    //   console.log("sign", sign.conditionals)
    //   sign.conditionals && sign.conditionals.forEach(cond => {
    //     if (cond === 'larger')
    //    cond='smaller'
    // })
    //   })

//  console.log(conditionals, "conditionals")
    //console.log(node.conditionals, "node conditionals")
  //   node.traverse(function (node, path, parent) {
  // switch (node.type) {
  //   case 'OperatorNode': console.log(node.type, node.op);    break;
  //   case 'ConstantNode': console.log(node.type, node.value); break;
  //   case 'SymbolNode': console.log(node.type, node.name); break;
  //   case 'RelationalNode': console.log(node, "node relational", node.args=node.params, "node args"); break;
  //   default:             console.log(node.type);
  // }})
    //let mirror = new mathjs.OperatorNode('>', 'larger', node.args)
   // console.log(node,"--------------------")
    // const temp = node.args[0]
    // node.args[0] = node.args[1]
    // node.args[1] = temp;

  //  node.args = node.args.map(sort);

};

export const sort = (node: MathNode): MathNode => {
  // console.log("[sort] :", JSON.stringify(node, null, "  "));

  if (node.isParenthesisNode) {
    node.content = sort(node.content);
    // console.log("[1 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

  if (node.type === "OperatorNode" && node.fn === "add") {
    node.args = node.args.map(sort);

    node.args.sort(compareNodes);
    // console.log("[2 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

    if (node.type === "OperatorNode" && node.fn === "smaller") {
    //let mirror = new mathjs.OperatorNode('>', 'larger', node.args)
      node.op = '>'
      node.fn = "larger"
      const temp = node.args[0]
      node.args[0] = node.args[1]
      node.args[1] = temp;


      node.args = node.args.map(sort);
        // console.log("[3 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }


      if (node.type === "OperatorNode" && node.fn === "larger") {
    //let mirror = new mathjs.OperatorNode('>', 'larger', node.args)
        node.op = '<'
        node.fn = "smaller"
     const temp = node.args[0]
      node.args[0] = node.args[1]
      node.args[1] = temp;

        node.args = node.args.map(sort);
    return node;
      }

  if (node.type === "RelationalNode") {

    sortRelational(node)
  //   node.traverse(function (node, path, parent) {
  // switch (node.type) {
  //   case 'OperatorNode': console.log(node.type, node.op);    break;
  //   case 'ConstantNode': console.log(node.type, node.value); break;
  //   case 'SymbolNode': console.log(node.type, node.name); break;
  //   case 'RelationalNode': console.log(node, "node relational", node.args=node.params, "node args"); break;
  //   default:             console.log(node.type);
  // }})
    //let mirror = new mathjs.OperatorNode('>', 'larger', node.args)
    console.log(node,"--------------------")
    // const temp = node.args[0]
    // node.args[0] = node.args[1]
    // node.args[1] = temp;

  //  node.args = node.args.map(sort);
    return node;
  }
  return node;
};
