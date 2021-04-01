const { create, all } = require("mathjs");

const mathjs = create(all);

function tzn(a, b) {
  return parseFloat(a, 10);
}

const simplifyRule = { l: "tzn(n1, n2)", r: "n1" };

tzn.transform = function (a, b) {
  console.log("input: a=" + a, b);
  // we can manipulate input here before executingtrailingZeroNum

  const res = tzn(a, b);

  console.log("result: " + res);
  // we can manipulate result here before returning

  return res;
};

mathjs.import({
  tzn,
});

const usingMathJs = (a, b, opts) => {
  console.log(" ------- ", a, b, opts, " -------- ");

  let am = mathjs.parse(a);
  let bm = mathjs.parse(b);

  console.log(am);
  console.log(bm);
  if (opts.ignoreTrailingZero) {
    am = mathjs.simplify(am, [simplifyRule]);
    bm = mathjs.simplify(bm, [simplifyRule]);
  }

  if (opts.ignoreOrder) {
    // todo -- sort the nodes
  } else {
    console.log("..");
    console.log(am);
    console.log(bm);
    const out = am.equals(bm);
    console.log(a, b, opts, out);
    return out;
  }
};

const isAstArrEqual = (a, b) => {
  console.log("this method does not exist - this is a demo");
  return true;
};

const stripTrailingZeros = (arr) => {
  // recurse through array - if operator is 'tzn' replace it with just the number
  return arr;
};

const astWithNewTypeComparison = (a, b, opts) => {
  console.log(" ------- astWithNewTypeComparison", a, b, opts);
  if (opts.ignoreTrailingZero) {
    a = stripTrailingZeros(a);
    b = stripTrailingZeros(b);
  }

  if (opts.ignoreOrder) {
    // todo apply sort
  } else {
    return isAstArrEqual(a, b);
  }
};
// 1.2340000 => tzn(1.234, 4);

usingMathJs(`tzn(1.234, 4)`, "1.234", { ignoreTrailingZero: true });
usingMathJs(`tzn(1.234, 4)`, "1.234", { ignoreTrailingZero: false });

astWithNewTypeComparison(["tzn", 1.234, 4], 1.234, {
  ignoreTrailingZero: true,
}); // => true
astWithNewTypeComparison(["tzn", 1.234, 4], 1.234, {
  ignoreTrailingZero: false,
}); // => false
