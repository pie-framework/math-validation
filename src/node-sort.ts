import { cosDependencies, MathNode, simplify } from "mathjs";
import { logger } from "./log";

import { mathjs as mjs } from "./mathjs";
const m: any = mjs;

const log = logger("mv:node-sort");
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
      // log("OUT:", out);
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
  log("acc:", acc);
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
  // log("op", op);
  return tree.reduce(reducer, []);
  // (acc, value) => {
  //   if (Array.isArray(value)) {
  //   }
  // }, []);

  // const params = tree.reduce((acc, value) => {
  //   if (Array.isArray(value)) {
  //   }
  // }, []);
  // log("params", params);
  // return [op, ...params]; //.flat(100);

  // log("tree now:", tree);
  // const mapped = tree.map((v) => {
  //   if (Array.isArray(v)) {
  //     if (v[0] === op) {
  //       v.shift();
  //       log("v now:", v);
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
  // log(
  //   "[compareNodes]: a '",
  //   a.toString(),
  //   "', b: '",
  //   b.toString(),
  //   "'"
  // );
  if (a.type === "SymbolNode" && b.type === "SymbolNode") {
    // log(a.name, "> ", b.name);
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
  log("THIS IS THE START ++++", JSON.stringify(node));

  node.traverse((node, path, parent) => {
    let reverse = false;
    if (node.conditionals) {
      node.conditionals = node.conditionals.map((cond: any) => {
        if (cond === "larger") {
          reverse = true;
          return "smaller";
        }

        return cond;
      });
    }

    if (node.params && reverse) {
      node.params.reverse();
    }

    // log("node++++", JSON.stringify(node), parent && parent.type, " ?????????") //,"path", JSON.stringify(path), "parrent",JSON.stringify(parent))

    if (parent && parent.type === "RelationalNode") {
      node = customSort(node);
    }
  });

  log("THIS IS THE END ++++", JSON.stringify(node));
  return node;
};

export const customSort = (node: MathNode): MathNode => {
  // log("[sort] :", JSON.stringify(node, null, "  "));
  log(node, "node");

  if (node.isParenthesisNode) {
    node.content = customSort(node.content);
    // log("[1 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

  if (
    node.type === "OperatorNode" &&
    (node.fn === "add" || node.fn === "multiply")
  ) {
    node.args = node.args.map(sort);

    node.args.sort(compareNodes);
    log("[2 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }
  if (node.type === "OperatorNode" && node.fn === "multiply") {
    node.args = node.args.map(sort);

    node.args.sort(compareNodes);
    log("[2 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

  if (node.type === "OperatorNode" && node.fn === "smaller") {
    //let mirror = new mathjs.OperatorNode('>', 'larger', node.args)
    node.op = ">";
    node.fn = "larger";
    const temp = node.args[0];
    node.args[0] = node.args[1];
    node.args[1] = temp;

    node.args = node.args.map(customSort);
    // log("[3 AFTER sort] :", JSON.stringify(node, null, "  "));
    return node;
  }

  return node;
};

export const sort = (node: any) => {
  if (node.type === "RelationalNode") {
    return sortRelational(node);
  }

  return customSort(node);
};

const newCompare = (a: MathNode, b: MathNode): number => {
  // log(a.type);
  log("[compareNodes]: a:", a.toString(), a.type);
  log("[compareNodes]: b:", b.toString(), b.type);
  if (a.type === "SymbolNode" && b.type === "SymbolNode") {
    // log(a.name, "> ", b.name);
    return a.name.localeCompare(b.name);
  }

  // both constants - sort by value
  if (a.type === "ConstantNode" && b.type === "ConstantNode") {
    log("a.value", a.value);
    log("b.value", b.value);
    return a.value - b.value; //(b.name);
  }

  // constants before any other node
  if (a.type === "ConstantNode" && b.type !== "ConstantNode") {
    return -1;
  }

  if (b.type === "ConstantNode" && a.type !== "ConstantNode") {
    return 1;
  }

  // if(a.type === "C")

  // return a.toString().localeCompare(b.toString());
  // // if (a.isSymbolNode && b.isOperatorNode) {
  // //   return 1;
  // // }
  // // if (b.isSymbolNode && a.isOperatorNode) {
  // //   return -1;
  // // }

  // // if (a.isOperatorNode) {
  // //   return 1;
  // // }
  // // if (b.isOperatorNode) {
  // //   return -1;
  // // }
  // // return 0;
};
const applySort = (
  node: MathNode,
  path: string | null,
  parent: MathNode | null
) => {
  // log("node: ", node.toString());
  // log("path: ", path);
  // log("parent: ", parent);
  if (node.fn === "add") {
    node.args = node.args.sort(newCompare);
  } else if (node.fn === "multiply") {
    node.args = node.args.sort(newCompare);
  }
  return node;
};

export const s = (node: MathNode) => {

  //console.log("input node ===============================", node)

  node = node.transform((node, path, parent) => {

    console.log("current node =========", node)
    console.log("current node =========", JSON.stringify(node))
    // console.log('&&&&', JSON.stringify(node), '---', path, '---', parent, "&& parent.args");

    console.log('parent op', parent && parent.op, 'node op', node.op);

    // //console.log(node.args[0].args, "======================nodeargs0args")

           console.log("parrent true ++++++++++++++++", parent)
      console.log("parrent fn", parent&&parent.fn)
    console.log("node fn", node.fn)
    console.log("node.args[1].tyoe",node.args && node.args[1].type )

    // if (parent && parent.fn == "add" && node.fn == parent.fn && node.args[1].type == "SymbolName") {
    //   console.log(" am intrat ")
    //   node.args[1].args = node.args[1].args.concat(parent.args[1])
    //   parent.args.splice(1, 1);
    // }


    if (node.args && node.args[1].type == "SymbolNode" && node.args[0].args) {
      node.args = node.args[0].args.concat(node.args[1])
      console.log("node.arg after splice", node.args, "node", node)
    }
  //   else if (parent && parent.args[0].args && node.type == "SymbolNode" && !node.args) {

  //    parent.args[0].args=parent.args[0].args.concat(node)
  //       console.log("parrent ===", parent)
  //     console.log("node===", node)
  //     return parent
  // }
  //   if (parent) {
  //     console.log("parrent true ++++++++++++++++")
  //     console.log("parrent op", parent.op)
  //     console.log("node op", parent.args[0].op)
  //       if (parent.op === parent.args[0].op && parent.op=== "+") {


  //         console.log("ce ne trebe ", parent.args[0].args)
  //         node.args = parent.args[0].args.concat(parent.args[1])

  //         console.log("parent args before splice", parent.args)
  //         parent.args = parent.args.splice(0, 1)

  //         console.log("parent args after splice", parent.args)
  //         console.log("result args????????????????", node.args)
  //         //node = new m.SymbolNode(node.args)
  //         return node
  //       }
  //     }



     console.log('result =======', node)

      return node
  })

  console.log("output node ===============================", JSON.stringify(node))
  // const node2 = new m.SymbolNode('x')
  // const node3 = new m.SymbolNode('y')
  // const node4 = new m.SymbolNode('z')

  // const resultNode = new m.OperatorNode("+", "add", [node3, node4, node2])
  // console.log("result Node", resultNode)

  return node.transform(applySort);
};
