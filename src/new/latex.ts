import me from "@pie-framework/math-expressions";

const astToTextOpts = {
  unicode_operators: {
    ne: function (operands) {
      return operands.join(" != ");
    },
    "%": function (operands) {
      return `percent(${operands[0]})`;
    },
  },
};

const latexToAstOpts = {
  missingFactor: (token, e) => {
    console.warn("missing factor for: ", token.token_type);
    if (token.token_type === "NUMBER") {
      throw e;
    }
    return 0;
  },
  unknownCommandBehavior: "passthrough",
};

export const latexToText = (latex) => {
  const la = new me.converters.latexToAstObj({
    ...latexToAstOpts,
  });

  const at = new me.converters.astToTextObj({
    ...astToTextOpts,
  });

  const ast = la.convert(latex);
  return at.convert(ast);
};

export const textToMathText = (latex) => {
  const la = new me.converters.textToAstObj({
    ...latexToAstOpts,
  });

  const at = new me.converters.astToTextObj({
    ...astToTextOpts,
  });

  const ast = la.convert(latex);

  return at.convert(ast);
};
