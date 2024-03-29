import { ParseError } from "./error";
import lexer, { Token } from "./lexer";
import { flatten } from "./flatten";
import { logger } from "../log";

const log = logger("mv:latex-to-ast");
// UPDATETHIS: Delete or change to new license & package name

/*
 * recursive descent parser for math expressions
 *
 * Copyright 2014-2017 by
 *  Jim Fowler <kisonecat@gmail.com>
 *  Duane Nykamp <nykamp@umn.edu>
 *
 * This file is part of a math-expressions library
 *
 * math-expressions is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or at your option any later version.
 *
 * math-expressions is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */

// UPDATETHIS: Is this grammar still correct?

/* Grammar:

   statement_list =
   statement_list ',' statement |
   statement

   statement =
   '\\dots' |
   statement_a '|' statement_a |
   statement_a 'MID' statement_a |
   statement_a ':' statement_a
   **** statement_a '|' statement_a
        used with turning off '|' statement '|' in baseFactor
        tried only after parse error encountered

   statement_a =
   statement_a 'OR' statement_b |
   statement_b

   statement_b =
   statement_b 'AND' relation |
   relation

   relation =
   'NOT' relation |
   relation '=' expression |
   relation 'NE' expression |
   relation '<' expression |
   relation '>' expression |
   relation 'LE' expression |
   relation 'GE' expression |
   relation 'IN' expression |
   relation 'NOTIN' expression |
   relation 'NI' expression |
   relation 'NOTNI' expression |
   relation 'SUBSET' expression |
   relation 'NOTSUBSET' expression |
   relation 'SUPERSET' expression |
   relation 'NOTSUPERSET' expression |
   expression

   expression =
   expression '+' term |
   expression '-' term |
   expression 'UNION' term |
   expression 'INTERSECT' term |
   '+' term |
   term

   term =
   term '*' factor |
   term nonMinusFactor |
   term '/' factor |
   factor

   baseFactor =
   '(' statement_list ')' |
   '[' statement_list ']' |
   '{' statement_list '}' |
   'LBRACE' statement_list 'RBRACE' |
   '(' statement ',' statement ']' |
   '[' statement ',' statement ')' |
   '|' statement '|' |
   \frac{statement}{statement} |
   number |
   variable |
   modified_function '(' statement_list ')' |
   modified_applied_function '(' statement_list ')' |
   modified_function '{' statement_list '}' |
   modified_applied_function '{' statement_list '}' |
   modified_function |
   modified_applied_function factor |
   sqrt '[' statement ']' '{' statement '}' |
   baseFactor '_' baseFactor |
   *** modified_applied_function factor
       allowed only if allowSimplifiedFunctionApplication==true
   *** '|' statement '|'
       allowed only at beginning of factor or if not currently in absolute value

   modified_function =
   function |
   function '_' baseFactor |
   function '_' baseFactor '^' factor |
   function '^' factor
   function "'"
   function '_' baseFactor "'"
   function '_' baseFactor "'" '^' factor
   function "'" '^' factor
   *** where the "'" after the functions can be repeated

   modified_applied_function =
   applied_function |
   applied_function '_' baseFactor |
   applied_function '_' baseFactor '^' factor |
   applied_function '^' factor
   applied_function "'"
   applied_function '_' baseFactor "'"
   applied_function '_' baseFactor "'" '^' factor
   applied_function "'" '^' factor
   *** where the "'" after the applied_functions can be repeated

   nonMinusFactor =
   baseFactor |
   baseFactor '^' factor |
   baseFactor '!' and/or "'" |
   baseFactor '!' and/or "'"  '^' factor|
   *** where '!' and/or "'"  indicates arbitrary sequence of "!" and/or "'"

   factor =
   '-' factor |
   nonMinusFactor

*/

// Some of the latex commands that lead to spacing
export const whitespace_rule =
  "\\s|\\\\,|\\\\!|\\\\ |\\\\>|\\\\;|\\\\:|\\\\quad\\b|\\\\qquad\\b";

// in order to parse as scientific notation, e.g., 3.2E-12 or .7E+3,
// it must be at the end or followed a comma, &, |, \|, ), }, \}, ], \\, or \end
const sci_notat_exp_regex =
  "(E[+\\-]?[0-9]+\\s*($|(?=\\,|&|\\||\\\\\\||\\)|\\}|\\\\}|\\]|\\\\\\\\|\\\\end)))?";

// TO-DO: ADD all mathjs built-in units?

const lengthUnit = "(mm|cm|km|ft|yd|mi|mmi|li|rd|angstrom|mil";
const volumeUnit = "|mL|ml|L|m3|in3|ft3|pt|qt|gal|bbl)";
const measurmentUnit = lengthUnit + volumeUnit + "{1}";
const numberWithCommasAsThousandsSeparator =
  "[0-9]{1,3}(\\,[0-9]{3})+(\\.[0-9]+)*";

// const latex_rules = [["\\\\neq(?![a-zA-Z])", "NE"]];
export const latex_rules = [
  [measurmentUnit, "UNIT"],
  ["\\$", "TEXT"],
  ["\\\\" + "\\$", "TEXT"],
  ["\\\\text{[a-zA-Z0-9\\s\\\\,\\\\.]+?}", "TEXT"],
  ["[0-9]+\\s*\\\\frac(?![a-zA-Z])", "MIXED_NUMBER"],
  [numberWithCommasAsThousandsSeparator + sci_notat_exp_regex, "NUMBER"],
  ["[0-9]+(\\.[0-9]*)?" + sci_notat_exp_regex, "NUMBER"],
  ["\\.[0-9]+" + sci_notat_exp_regex, "NUMBER"],
  [",", ","],
  ["\\*", "*"],
  ["\\×", "*"],
  ["\\•", "*"],
  ["\\·", "*"],
  ["\\/", "/"],
  ["\\÷", "/"],
  ["%", "PERCENT"],
  ["\\\\%", "PERCENT"],
  ["−", "-"],
  ["-", "-"],
  ["\\+", "+"],
  ["\\^", "^"],
  ["\\(", "("],
  ["\\\\left\\s*\\(", "("],
  ["\\\\bigl\\s*\\(", "("],
  ["\\\\Bigl\\s*\\(", "("],
  ["\\\\biggl\\s*\\(", "("],
  ["\\\\Biggl\\s*\\(", "("],
  ["\\)", ")"],
  ["\\\\right\\s*\\)", ")"],
  ["\\\\bigr\\s*\\)", ")"],
  ["\\\\Bigr\\s*\\)", ")"],
  ["\\\\biggr\\s*\\)", ")"],
  ["\\\\Biggr\\s*\\)", ")"],
  ["\\[", "["],
  ["\\\\left\\s*\\[", "["],
  ["\\\\bigl\\s*\\[", "["],
  ["\\\\Bigl\\s*\\[", "["],
  ["\\\\biggl\\s*\\[", "["],
  ["\\\\Biggl\\s*\\[", "["],
  ["\\]", "]"],
  ["\\\\right\\s*\\]", "]"],
  ["\\\\bigr\\s*\\]", "]"],
  ["\\\\Bigr\\s*\\]", "]"],
  ["\\\\biggr\\s*\\]", "]"],
  ["\\\\Biggr\\s*\\]", "]"],
  ["\\|", "|"],
  ["\\\\left\\s*\\|", "|L"],
  ["\\\\bigl\\s*\\|", "|L"],
  ["\\\\Bigl\\s*\\|", "|L"],
  ["\\\\biggl\\s*\\|", "|L"],
  ["\\\\Biggl\\s*\\|", "|L"],
  ["\\\\right\\s*\\|", "|"],
  ["\\\\bigr\\s*\\|", "|"],
  ["\\\\Bigr\\s*\\|", "|"],
  ["\\\\biggr\\s*\\|", "|"],
  ["\\\\Biggr\\s*\\|", "|"],
  ["\\\\big\\s*\\|", "|"],
  ["\\\\Big\\s*\\|", "|"],
  ["\\\\bigg\\s*\\|", "|"],
  ["\\\\Bigg\\s*\\|", "|"],
  ["{", "{"],
  ["}", "}"],
  ["\\\\{", "LBRACE"],
  ["\\\\left\\s*\\\\{", "LBRACE"],
  ["\\\\bigl\\s*\\\\{", "LBRACE"],
  ["\\\\Bigl\\s*\\\\{", "LBRACE"],
  ["\\\\biggl\\s*\\\\{", "LBRACE"],
  ["\\\\Biggl\\s*\\\\{", "LBRACE"],
  ["\\\\}", "RBRACE"],
  ["\\\\right\\s*\\\\}", "RBRACE"],
  ["\\\\bigr\\s*\\\\}", "RBRACE"],
  ["\\\\Bigr\\s*\\\\}", "RBRACE"],
  ["\\\\biggr\\s*\\\\}", "RBRACE"],
  ["\\\\Biggr\\s*\\\\}", "RBRACE"],
  ["\\\\cdot(?![a-zA-Z])", "*"],
  ["\\\\div(?![a-zA-Z])", "/"],
  ["\\\\times(?![a-zA-Z])", "*"],
  ["\\\\frac(?![a-zA-Z])", "FRAC"],

  ["°", "deg"],
  ["°", "deg"],
  ["\\\\degree", "deg"],
  ["\\\\deg", "deg"],

  ["\\\\grade", "grad"],
  ["\\\\gon", "grad"],
  ["\\\\grad", "grad"],

  [":", ":"],
  ["\\\\mid", "MID"],

  ["\\\\vartheta(?![a-zA-Z])", "LATEXCOMMAND", "\\theta"],
  ["\\\\π", "LATEXCOMMAND", "\\pi"],
  ["\\\\varepsilon(?![a-zA-Z])", "LATEXCOMMAND", "\\epsilon"],
  ["\\\\varrho(?![a-zA-Z])", "LATEXCOMMAND", "\\rho"],
  ["\\\\varphi(?![a-zA-Z])", "LATEXCOMMAND", "\\phi"],

  ["\\\\infty(?![a-zA-Z])", "INFINITY"],
  ["\\\\Infinity(?![a-zA-Z])", "INFINITY"],

  ["\\\\sqrt(?![a-zA-Z])", "SQRT"],
  ["\\\\log(?![a-zA-Z])", "LOG"],
  ["\\\\ln(?![a-zA-Z])", "LN"],

  ["\\\\cosec", "LATEXCOMMAND", "\\csc"],

  // inverse trigonometric functions
  ["\\\\sin\\^\\{-1}(?![a-zA-Z])", "LATEXCOMMAND", "\\asin"],
  ["\\\\cos\\^\\{-1}(?![a-zA-Z])", "LATEXCOMMAND", "\\acos"],
  ["\\\\tan\\^\\{-1}(?![a-zA-Z])", "LATEXCOMMAND", "\\atan"],
  ["\\\\cot\\^\\{-1}(?![a-zA-Z])", "LATEXCOMMAND", "\\acot"],
  ["\\\\sec\\^\\{-1}(?![a-zA-Z])", "LATEXCOMMAND", "\\asec"],
  ["\\\\csc\\^\\{-1}(?![a-zA-Z])", "LATEXCOMMAND", "\\acsc"],

  ["\\\\arsin(?![a-zA-Z])", "LATEXCOMMAND", "\\asin"],
  ["\\\\arcsin(?![a-zA-Z])", "LATEXCOMMAND", "\\asin"],
  ["\\\\arcos(?![a-zA-Z])", "LATEXCOMMAND", "\\acos"],
  ["\\\\arccos(?![a-zA-Z])", "LATEXCOMMAND", "\\acos"],
  ["\\\\artan(?![a-zA-Z])", "LATEXCOMMAND", "\\atan"],
  ["\\\\arctan(?![a-zA-Z])", "LATEXCOMMAND", "\\atan"],
  ["\\\\arcot(?![a-zA-Z])", "LATEXCOMMAND", "\\acot"],
  ["\\\\arccot(?![a-zA-Z])", "LATEXCOMMAND", "\\acot"],
  ["\\\\arsec(?![a-zA-Z])", "LATEXCOMMAND", "\\asec"],
  ["\\\\arcsec(?![a-zA-Z])", "LATEXCOMMAND", "\\asec"],
  ["\\\\arcsc(?![a-zA-Z])", "LATEXCOMMAND", "\\acsc"],
  ["\\\\arccsc(?![a-zA-Z])", "LATEXCOMMAND", "\\acsc"],

  ["\\\\land(?![a-zA-Z])", "AND"],
  ["\\\\wedge(?![a-zA-Z])", "AND"],

  ["\\\\lor(?![a-zA-Z])", "OR"],
  ["\\\\vee(?![a-zA-Z])", "OR"],

  ["\\\\lnot(?![a-zA-Z])", "NOT"],

  ["=", "="],
  ["≠", "NE"],
  ["\\\\neq(?![a-zA-Z])", "NE"],
  ["\\\\ne(?![a-zA-Z])", "NE"],
  ["\\\\not\\s*=", "NE"],
  ["\\\\leq(?![a-zA-Z])", "LE"],
  ["\\\\le(?![a-zA-Z])", "LE"],
  ["\\\\geq(?![a-zA-Z])", "GE"],
  ["\\\\ge(?![a-zA-Z])", "GE"],
  ["<", "<"],
  ["≤", "LE"],
  ["\\\\lt(?![a-zA-Z])", "<"],
  [">", ">"],
  ["≥", "GE"],
  ["\\\\gt(?![a-zA-Z])", ">"],

  // is approximately
  ["\\\\approx", "≈"],
  ["≈", "≈"],

  // not almost equal to
  ["\\\\napprox", "≉"],
  ["≉", "≉"],

  // is similar or equal to
  ["\\\\simeq", "≃"],
  ["≃", "≃"],

  // is similar to
  ["\\\\sim", "~"],
  ["~", "~"],

  // is not similar to
  ["\\\\nsim", "≁"],
  ["≁", "≁"],

  // is congruent to
  ["\\\\cong", "≅"],
  ["≅", "≅"],

  // is not congurent to
  ["\\\\ncong", "≆"],
  ["≆", "≆"],

  // inverse f and g functions are treated as text
  ["f\\^\\{-1}", "TEXT"],
  ["g\\^\\{-1}", "TEXT"],

  ["\\\\in(?![a-zA-Z])", "IN"],

  ["\\\\notin(?![a-zA-Z])", "NOTIN"],
  ["\\\\not\\s*\\\\in(?![a-zA-Z])", "NOTIN"],

  ["\\\\ni(?![a-zA-Z])", "NI"],

  ["\\\\not\\s*\\\\ni(?![a-zA-Z])", "NOTNI"],

  ["\\\\subset(?![a-zA-Z])", "SUBSET"],

  ["\\\\not\\s*\\\\subset(?![a-zA-Z])", "NOTSUBSET"],

  ["\\\\supset(?![a-zA-Z])", "SUPERSET"],

  ["\\\\not\\s*\\\\supset(?![a-zA-Z])", "NOTSUPERSET"],

  ["\\\\cup(?![a-zA-Z])", "UNION"],

  ["\\\\cap(?![a-zA-Z])", "INTERSECT"],

  ["!", "!"],
  ["'", "'"],
  ["_", "_"],
  ["&", "&"],
  ["\\\\ldots", "LDOTS"],

  ["\\\\\\\\", "LINEBREAK"],

  ["\\\\begin\\s*{\\s*[a-zA-Z0-9]+\\s*}", "BEGINENVIRONMENT"],

  ["\\\\end\\s*{\\s*[a-zA-Z0-9]+\\s*}", "ENDENVIRONMENT"],

  ["\\\\var\\s*{\\s*[a-zA-Z0-9]+\\s*}", "VARMULTICHAR"],

  ["\\\\[a-zA-Z]+(?![a-zA-Z])", "LATEXCOMMAND"],
  ["[a-zA-Z]", "VAR"],
];

// defaults for parsers if not overridden by context

// if true, allowed applied functions to omit parentheses around argument
// if false, omitting parentheses will lead to a Parse Error
const allowSimplifiedFunctionApplicationDefault = true;

// allowed multicharacter latex symbols
// in addition to the below applied function symbols
const allowedLatexSymbolsDefault = [
  "alpha",
  "beta",
  "gamma",
  "Gamma",
  "delta",
  "Delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "Theta",
  "iota",
  "kappa",
  "lambda",
  "Lambda",
  "mu",
  "nu",
  "xi",
  "Xi",
  "pi",
  "Pi",
  "rho",
  "sigma",
  "Sigma",
  "tau",
  "Tau",
  "upsilon",
  "Upsilon",
  "phi",
  "Phi",
  "chi",
  "psi",
  "Psi",
  "omega",
  "Omega",
  "partial",
];

// Applied functions must be given an argument so that
// they are applied to the argument
const appliedFunctionSymbolsDefault = [
  "abs",
  "exp",
  "log",
  "ln",
  "log10",
  "sign",
  "sqrt",
  "erf",
  "acos",
  "acosh",
  "acot",
  "acoth",
  "acsc",
  "acsch",
  "asec",
  "asech",
  "asin",
  "asinh",
  "atan",
  "atanh",
  "cos",
  "cosh",
  "cot",
  "coth",
  "csc",
  "csch",
  "sec",
  "sech",
  "sin",
  "sinh",
  "tan",
  "tanh",
  "arg",
];

const missingFactorDefaultBehavior = function (token, e) {
  throw e;
};

export type Opts = {
  allowSimplifiedFunctionApplication: boolean;
  allowedLatexSymbols: string[];
  appliedFunctionSymbols: string[];
  functionSymbols: string[];
  parseLeibnizNotation: boolean;
  missingFactor: (token: Token, e: Error) => number | string;
  unknownCommandBehavior: "error" | "passthrough";
};

export const DEFAULT_OPTS: Opts = {
  allowSimplifiedFunctionApplication: allowSimplifiedFunctionApplicationDefault,
  allowedLatexSymbols: allowedLatexSymbolsDefault,
  appliedFunctionSymbols: appliedFunctionSymbolsDefault,
  /**
   *  Functions could have an argument, in which case they are applied
   * or, if they don't have an argument in parentheses, then they are treated
   * like a variable, except that trailing ^ and ' have higher precedence
   */
  functionSymbols: ["f", "g"],
  parseLeibnizNotation: true,
  missingFactor: missingFactorDefaultBehavior,
  unknownCommandBehavior: "error",
};

export class LatexToAst {
  private unknownCommandBehavior: string;
  private lexer: lexer;
  private token: Token;
  private opts: Opts;
  constructor(opts?: Opts) {
    this.opts = { ...DEFAULT_OPTS, ...opts };

    if (
      this.opts.unknownCommandBehavior !== "error" &&
      this.opts.unknownCommandBehavior !== "passthrough"
    ) {
      throw new Error(
        "Unknown behavior for unknown command: " +
          this.opts.unknownCommandBehavior
      );
    }
    this.lexer = new lexer(latex_rules, whitespace_rule);
  }

  advance(params?: any) {
    this.token = this.lexer.advance(params);
    if (this.token.token_type === "INVALID") {
      throw new ParseError(
        "Invalid symbol '" + this.token.original_text + "'",
        this.lexer.location
      );
    }
  }

  return_state() {
    return {
      lexer_state: this.lexer.return_state(),
      token: Object.assign({}, this.token),
    };
  }

  set_state(state) {
    this.lexer.set_state(state.lexer_state);
    this.token = Object.assign({}, state.token);
  }

  public convert(input, pars?: any) {
    this.lexer.set_input(input);
    this.advance();

    var result = this.statement_list(pars);
    if (this.token.token_type !== "EOF") {
      throw new ParseError(
        "Invalid location of '" + this.token.original_text + "'",
        this.lexer.location
      );
    }

    return flatten(result);
  }

  statement_list(pars?: any) {
    var list = [this.statement(pars)];

    while (this.token.token_type === ",") {
      this.advance();
      list.push(this.statement(pars));
    }

    if (list.length > 1) list = ["list"].concat(list);
    else list = list[0];

    return list;
  }

  statement(
    opts: {
      parse_absolute_value?: boolean;
      inside_absolute_value?: number;
      unknownCommands?: string;
    } = {}
  ) {
    const { inside_absolute_value = 0, unknownCommands = "error" } = opts;
    // \ldots can be a statement by itself
    if (this.token.token_type === "LDOTS") {
      this.advance();
      return ["ldots"];
    }

    var original_state;

    try {
      original_state = this.return_state();

      let lhs = this.statement_a({
        inside_absolute_value: inside_absolute_value,
        unknownCommands: unknownCommands,
      });

      //console.log("lhs:", lhs);

      if (this.token.token_type !== ":" && this.token.token_type !== "MID")
        return lhs;

      let operator = this.token.token_type === ":" ? ":" : "|";

      this.advance();

      let rhs = this.statement_a({ unknownCommands: unknownCommands });

      return [operator, lhs, rhs];
    } catch (e) {
      try {
        // if ran into problem parsing statement
        // then try again with ignoring absolute value
        // and then interpreting bar as a binary operator

        // return state to what it was before attempting to parse statement
        this.set_state(original_state);

        let lhs = this.statement_a({ parse_absolute_value: false });

        //console.log("lhs:", lhs);
        if (this.token.token_type[0] !== "|") {
          throw e;
        }

        this.advance();

        let rhs = this.statement_a({ parse_absolute_value: false });

        return ["|", lhs, rhs];
      } catch (e2) {
        throw e; // throw original error
      }
    }
  }

  statement_a(opts: any = {}) {
    const {
      inside_absolute_value = 0,
      parse_absolute_value = true,
      unknownCommands,
    } = opts;

    var lhs = this.statement_b({
      inside_absolute_value: inside_absolute_value,
      parse_absolute_value: parse_absolute_value,
      unknownCommands: unknownCommands,
    });

    while (this.token.token_type === "OR") {
      let operation = this.token.token_type.toLowerCase();

      this.advance();

      let rhs = this.statement_b({
        inside_absolute_value: inside_absolute_value,
        parse_absolute_value: parse_absolute_value,
        unknownCommands: unknownCommands,
      });

      lhs = [operation, lhs, rhs];
    }

    return lhs;
  }

  statement_b(params) {
    // split AND into second statement to give higher precedence than OR

    var lhs = this.relation(params);

    while (this.token.token_type === "AND") {
      let operation = this.token.token_type.toLowerCase();

      this.advance();

      let rhs = this.relation(params);

      lhs = [operation, lhs, rhs];
    }

    return lhs;
  }

  relation(params) {
    if (this.token.token_type === "NOT" || this.token.token_type === "!") {
      this.advance();
      return ["not", this.relation(params)];
    }

    var lhs = this.expression(params);

    let relationalToken = (token) =>
      token === "<" ||
      token === "LE" ||
      token === ">" ||
      token === "GE" ||
      token === "NE";

    while (
      this.token.token_type === "=" ||
      this.token.token_type === "NE" ||
      this.token.token_type === "<" ||
      this.token.token_type === ">" ||
      this.token.token_type === "LE" ||
      this.token.token_type === "GE" ||
      this.token.token_type === "IN" ||
      this.token.token_type === "NOTIN" ||
      this.token.token_type === "NI" ||
      this.token.token_type === "NOTNI" ||
      this.token.token_type === "SUBSET" ||
      this.token.token_type === "NOTSUBSET" ||
      this.token.token_type === "SUPERSET" ||
      this.token.token_type === "NOTSUPERSET" ||
      this.token.token_type === "≈" ||
      this.token.token_type === "≉" ||
      this.token.token_type === "~" ||
      this.token.token_type === "≃" ||
      this.token.token_type === "≁" ||
      this.token.token_type === "≅" ||
      this.token.token_type === "≆"
    ) {
      let operation = this.token.token_type.toLowerCase();

      let inequality_sequence = relationalToken(this.token.token_type);

      this.advance();
      let rhs = this.expression(params);

      const relationalOperator = (operatorSign: string) => {
        switch (operatorSign) {
          case "<":
            return "smaller";
          case "LE":
          case "le":
            return "smallerEq";
          case ">":
            return "larger";
          case "GE":
          case "ge":
            return "largerEq";
          case "NE":
          case "ne":
            return "unequal";
        }
      };

      if (inequality_sequence && relationalToken(this.token.token_type)) {
        let strict: (string | boolean)[] = ["tuple"];

        strict.push(relationalOperator(operation));
        let args = ["tuple", lhs, rhs];

        while (relationalToken(this.token.token_type)) {
          strict.push(relationalOperator(this.token.token_type));
          this.advance();
          args.push(this.expression(params));
        }

        lhs = ["relational", args, strict];
      } else if (operation === "=") {
        lhs = [operation, lhs, rhs];

        // check for sequence of multiple =
        while (this.token.token_type === "=") {
          this.advance();
          lhs.push(this.expression(params));
        }
      } else {
        lhs = [operation, lhs, rhs];
      }
    }

    return lhs;
  }

  expression(params) {
    if (this.token.token_type === "+") this.advance();

    let negative_begin = false;
    if (this.token.token_type === "-") {
      negative_begin = true;
      this.advance();
    }

    var lhs = this.term(params);

    if (negative_begin) {
      lhs = ["-", lhs];
    }

    while (
      this.token.token_type === "+" ||
      this.token.token_type === "-" ||
      this.token.token_type === "UNION" ||
      this.token.token_type === "INTERSECT"
    ) {
      let operation = this.token.token_type.toLowerCase();
      let negative = false;

      if (this.token.token_type === "-") {
        operation = "+";
        negative = true;
        this.advance();
      } else {
        this.advance();
        // @ts-ignore
        if (operation === "+" && this.token.token_type === "-") {
          negative = true;
          this.advance();
        }
      }
      let rhs = this.term(params);
      if (negative) {
        rhs = ["-", rhs];
      }

      lhs = [operation, lhs, rhs];
    }

    return lhs;
  }

  term(params) {
    var lhs;

    try {
      lhs = this.factor(params);
    } catch (e) {
      lhs = this.opts.missingFactor(this.token, e);
      lhs = Number.isFinite(lhs) ? lhs : 0;
    }

    var keepGoing = false;

    do {
      keepGoing = false;

      if (this.token.token_type === "PERCENT") {
        this.advance();
        lhs = ["%", lhs];
        keepGoing = true;
      } else if (this.token.token_type === "*") {
        this.advance();
        lhs = ["*", lhs, this.factor(params)];
        keepGoing = true;
      } else if (this.token.token_type === "/") {
        this.advance();
        lhs = ["/", lhs, this.factor(params)];
        keepGoing = true;
      } else {
        // this is the one case where a | could indicate a closing absolute value
        let params2 = Object.assign({}, params);
        params2.allow_absolute_value_closing = true;
        let rhs = this.nonMinusFactor(params2);
        if (rhs !== false) {
          lhs = ["*", lhs, rhs];
          keepGoing = true;
        }
      }
    } while (keepGoing);

    return lhs;
  }

  factor(params) {
    // console.log("factor:", this.token);
    // console.log("before: lexer state:", this.lexer.return_state());
    if (this.token.token_type === "-") {
      this.advance();
      return ["-", this.factor(params)];
    }

    var result = this.nonMinusFactor(params);
    // console.log("result", result);
    if (result === false) {
      if (this.token.token_type === "EOF") {
        throw new ParseError("Unexpected end of input", this.lexer.location);
      } else {
        //console.log("lexer state:", this.lexer.return_state());
        throw new ParseError(
          "Invalid location of '" + this.token.original_text + "'",
          this.lexer.location
        );
      }
    } else {
      return result;
    }
  }

  nonMinusFactor(params) {
    let result = this.baseFactor(params);

    // allow arbitrary sequence of factorials
    if (this.token.token_type === "!" || this.token.token_type === "'") {
      if (result === false)
        throw new ParseError(
          "Invalid location of " + this.token.token_type,
          this.lexer.location
        );
      while (this.token.token_type === "!" || this.token.token_type === "'") {
        if (this.token.token_type === "!")
          result = ["apply", "factorial", result];
        else result = ["prime", result];
        this.advance();
      }
    }

    if (this.token.token_type === "^") {
      if (result === false) {
        throw new ParseError("Invalid location of ^", this.lexer.location);
      }
      this.advance();

      // do not allow absolute value closing here
      let params2 = Object.assign({}, params);
      delete params2.allow_absolute_value_closing;
      delete params2.inside_absolute_value;

      return ["^", result, this.factor(params2)];
    }

    return result;
  }

  fraction({
    inside_absolute_value = 0,
    parse_absolute_value = true,
    allow_absolute_value_closing = false,
    unknownCommands = "error",
  }) {
    this.advance();

    if (this.token.token_type !== "{") {
      throw new ParseError("Expecting {", this.lexer.location);
    }
    this.advance();

    // determine if may be a derivative in Leibniz notation
    if (this.opts.parseLeibnizNotation) {
      let original_state = this.return_state();

      let r = this.leibniz_notation();

      if (r) {
        // successfully parsed derivative in Leibniz notation, so return
        return r;
      } else {
        // didn't find a properly format Leibniz notation
        // so reset state and continue
        this.set_state(original_state);
      }
    }

    let numerator = this.statement({
      parse_absolute_value: parse_absolute_value,
      unknownCommands: unknownCommands,
    });
    // @ts-ignore
    if (this.token.token_type !== "}") {
      throw new ParseError("Expecting }", this.lexer.location);
    }
    this.advance();

    if (this.token.token_type !== "{") {
      throw new ParseError("Expecting {", this.lexer.location);
    }
    this.advance();

    let denominator = this.statement({
      parse_absolute_value: parse_absolute_value,
      unknownCommands: unknownCommands,
    });

    if (this.token.token_type !== "}") {
      throw new ParseError("Expecting }", this.lexer.location);
    }
    this.advance();

    return ["/", numerator, denominator];
  }

  baseFactor({
    inside_absolute_value = 0,
    parse_absolute_value = true,
    allow_absolute_value_closing = false,
    unknownCommands = "error",
  } = {}) {
    var result = false;

    if (this.token.token_type === "MIXED_NUMBER") {
      try {
        const t = this.token.token_text.split("\\\\frac");
        const numberString = t[0].trim();
        const number = parseInt(numberString, 10);
        const f = this.fraction({});
        // this is correct, to convert a mixed number to an improper fraction we have to multiply the demoninator by the whole number and add the result to the numerator
        return ["+", number, f];
      } catch (e) {
        throw new ParseError(`Mixed number parsing failed: ${e.message}`);
      }
    }

    if (this.token.token_type === "FRAC") {
      return this.fraction({});
    }

    if (this.token.token_type === "TEXT") {
      const text = this.token.original_text.replace(/[[\]\\]/g, "");
      this.advance();

      return text.toString();
    }

    if (this.token.token_type === "BEGINENVIRONMENT") {
      let environment = /\\begin\s*{\s*([a-zA-Z0-9]+)\s*}/.exec(
        this.token.token_text
      )[1];

      if (["matrix", "pmatrix", "bmatrix"].includes(environment)) {
        let n_rows = 0;
        let n_cols = 0;

        let all_rows = [];
        let row = [];
        let n_this_row = 0;
        let last_token = this.token.token_type;

        this.advance();

        //@ts-ignore
        while (this.token.token_type !== "ENDENVIRONMENT") {
          //@ts-ignore
          if (this.token.token_type === "&") {
            if (last_token === "&" || last_token === "LINEBREAK") {
              // blank entry, let entry be zero
              row.push(0);
              n_this_row += 1;
            }
            last_token = this.token.token_type;
            this.advance();
            //@ts-ignore
          } else if (this.token.token_type === "LINEBREAK") {
            if (last_token === "&" || last_token === "LINEBREAK") {
              // blank entry, let entry be zero
              row.push(0);
              n_this_row += 1;
            }
            all_rows.push(row);
            if (n_this_row > n_cols) n_cols = n_this_row;

            n_rows += 1;
            n_this_row = 0;
            row = [];
            last_token = this.token.token_type;
            this.advance();
          } else {
            if (
              last_token === "&" ||
              last_token === "LINEBREAK" ||
              "BEGINENVIRONMENT"
            ) {
              row.push(
                this.statement({
                  parse_absolute_value: parse_absolute_value,
                  unknownCommands: unknownCommands,
                })
              );
              n_this_row += 1;
              last_token = " ";
            } else {
              throw new ParseError(
                "Invalid location of " + this.token.original_text,
                this.lexer.location
              );
            }
          }
        }

        // token is ENDENVIRONMENT
        let environment2 = /\\end\s*{\s*([a-zA-Z0-9]+)\s*}/.exec(
          this.token.token_text
        )[1];
        if (environment2 !== environment) {
          throw new ParseError(
            "Expecting \\end{" + environment + "}",
            this.lexer.location
          );
        }

        // add last row
        if (last_token === "&") {
          // blank entry, let entry be zero
          row.push(0);
          n_this_row += 1;
        }
        all_rows.push(row);
        if (n_this_row > n_cols) n_cols = n_this_row;
        n_rows += 1;

        this.advance();

        // create matrix
        // @ts-ignore
        result = ["matrix", ["tuple", n_rows, n_cols]];
        let body = ["tuple"];
        for (let r of all_rows) {
          let new_row = ["tuple"].concat(r);
          //@ts-ignore
          for (let i = r.length; i < n_cols; i += 1) new_row.push(0);

          // @ts-ignore
          body.push(new_row);
        }
        // @ts-ignore
        result.push(body);

        return result;
      } else {
        throw new ParseError(
          "Unrecognized environment " + environment,
          this.lexer.location
        );
      }
    }

    if (this.token.token_type === "NUMBER") {
      // @ts-ignore
      result = this.token.token_text.replace(/,/g, "");

      let removeLeadingZeros = (result) =>
        result.indexOf(".") >= 0
          ? result.replace(/^[0]*([0-9])(.*)/, "$1$2")
          : result.replace(/0*([1-9]*)/, "$1");

      // @ts-ignore
      let parsedNumber = result === "0" ? result : removeLeadingZeros(result);

      if (parsedNumber.startsWith(".")) {
        parsedNumber = "0" + parsedNumber;
      }

      const number = parseFloat(parsedNumber);

      /** trailing zero number ['tzn', number, countOfZeros] */

      // @ts-ignore
      if (parsedNumber !== number.toString()) {
        const p = number.toString();
        // @ts-ignore
        const sub = parsedNumber
          // @ts-ignore
          .substring(p.length)
          .split("")
          .filter((c) => c === "0");
        const noOfTrailingZeros = sub.length;

        // @ts-ignore
        result = ["tzn", number, noOfTrailingZeros];
      } else {
        // @ts-ignore
        result = number;
      }

      this.advance();
    } else if (this.token.token_type === "INFINITY") {
      // @ts-ignore
      result = Infinity;

      this.advance();
    } else if (this.token.token_type === "deg") {
      // conversion of degrees in radians - angle configuration
      const degree = 355 / (180 * 113);

      // @ts-ignore
      result = ["*", degree];

      this.advance();
    } else if (this.token.token_type === "grad") {
      //conversion of gradians in radians - angle configuration
      const gradian = 355 / (200 * 113);

      // @ts-ignore
      result = ["*", gradian];
      this.advance();
    } else if (this.token.token_type === "UNIT") {
      // @ts-ignore
      result = ["unit", this.token.token_text];

      this.advance();
    } else if (this.token.token_type === "SQRT") {
      this.advance();

      let root = 2;
      let parameter;
      // @ts-ignore
      if (this.token.token_type === "[") {
        this.advance();
        parameter = this.statement({
          parse_absolute_value: parse_absolute_value,
          unknownCommands: unknownCommands,
        });

        if (this.token.token_type !== "]") {
          throw new ParseError("Expecting ]", this.lexer.location);
        }

        this.advance();
        root = parameter;
      }

      // @ts-ignore
      if (this.token.token_type == "{") {
        this.advance();
        parameter = this.statement({
          parse_absolute_value: parse_absolute_value,
          unknownCommands: unknownCommands,
        });
        // @ts-ignore
        if (this.token.token_type !== "}") {
          throw new ParseError("Expecting }", this.lexer.location);
        }

        this.advance();
      } else {
        parameter = this.statement({
          parse_absolute_value: parse_absolute_value,
          unknownCommands: unknownCommands,
        });
      }

      // @ts-ignore
      if (root === 2) result = ["apply", "sqrt", parameter];
      // @ts-ignore
      else result = ["^", parameter, ["/", 1, root]];
    } else if (
      this.token.token_type === "LOG" ||
      this.token.token_type === "LN"
    ) {
      // function log(x) in JS returns ln(x)
      let base = this.token.token_type === "LOG" ? 10 : "e";
      let parameter;

      this.advance();
      // @ts-ignore
      if (this.token.token_type === "_") {
        this.advance();
        // @ts-ignore
        if (this.token.token_type === "{") {
          this.advance();
          parameter = this.statement({
            parse_absolute_value: parse_absolute_value,
            unknownCommands: unknownCommands,
          });
          if (this.token.token_type !== "}") {
            throw new ParseError("Expecting }", this.lexer.location);
          }

          this.advance();
          base = parameter;
        }
      }

      // @ts-ignore
      if (this.token.token_type == "(") {
        this.advance();
        parameter = this.statement({
          parse_absolute_value: parse_absolute_value,
          unknownCommands: unknownCommands,
        });

        if (this.token.token_type !== ")") {
          throw new ParseError("Expecting )", this.lexer.location);
        }

        this.advance();
      } else {
        parameter = this.token.token_text;
        
        this.advance();
      }

      // @ts-ignore
      if (base === 10) result = ["apply", "log", ["tuple", parameter, base]];
      // @ts-ignore
      else if (base === "e") result = ["apply", "log", parameter];
      // @ts-ignore
      else result = ["apply", "log", ["tuple", parameter, base]];
    } else if (
      this.token.token_type === "VAR" ||
      this.token.token_type === "LATEXCOMMAND" ||
      this.token.token_type === "VARMULTICHAR"
    ) {
      // @ts-ignore
      result = this.token.token_text;

      if (this.token.token_type === "LATEXCOMMAND") {
        // @ts-ignore
        result = result.slice(1);

        const isKnownCommand =
          // @ts-ignore
          this.opts.appliedFunctionSymbols.includes(result) ||
          // @ts-ignore
          this.opts.functionSymbols.includes(result) ||
          // @ts-ignore
          this.opts.allowedLatexSymbols.includes(result);

        if (!isKnownCommand) {
          if (this.unknownCommandBehavior === "error") {
            throw new ParseError(
              "Unrecognized latex command " + this.token.original_text,
              this.lexer.location
            );
          }
        }
      } else if (this.token.token_type === "VARMULTICHAR") {
        // strip out name of variable from \var command
        // @ts-ignore
        result = /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(result)[1];
      }

      if (
        // @ts-ignore
        this.opts.appliedFunctionSymbols.includes(result) ||
        // @ts-ignore
        this.opts.functionSymbols.includes(result)
      ) {
        let must_apply = false;
        // @ts-ignore
        if (this.opts.appliedFunctionSymbols.includes(result))
          must_apply = true;

        this.advance();

        // @ts-ignore
        if (this.token.token_type === "_") {
          this.advance();
          let subresult = this.baseFactor({
            parse_absolute_value: parse_absolute_value,
          });

          // since baseFactor could return false, must check
          if (subresult === false) {
            if (this.token.token_type === "EOF") {
              throw new ParseError(
                "Unexpected end of input",
                this.lexer.location
              );
            } else {
              throw new ParseError(
                "Invalid location of '" + this.token.original_text + "'",
                this.lexer.location
              );
            }
          }
          // @ts-ignore
          result = ["_", result, subresult];
        }

        // @ts-ignore
        while (this.token.token_type === "'") {
          // @ts-ignore
          result = ["prime", result];
          this.advance();
        }

        // @ts-ignore
        if (this.token.token_type === "^") {
          this.advance();
          // @ts-ignore
          result = [
            "^",
            result,
            this.factor({ parse_absolute_value: parse_absolute_value }),
          ];
        }

        // @ts-ignore
        if (this.token.token_type === "{" || this.token.token_type === "(") {
          let expected_right;
          if (this.token.token_type === "{") expected_right = "}";
          else expected_right = ")";

          this.advance();
          let parameters = this.statement_list();

          if (this.token.token_type !== expected_right) {
            throw new ParseError(
              "Expecting " + expected_right,
              this.lexer.location
            );
          }
          this.advance();

          // @ts-ignore
          result = ["apply", result, parameters];
        } else {
          // if was an applied function symbol,
          // cannot omit argument
          if (must_apply) {
            // @ts-ignore
            if (!this.opts.allowSimplifiedFunctionApplication)
              throw new ParseError(
                "Expecting ( after function",
                this.lexer.location
              );

            // if allow simplied function application
            // let the argument be the next factor
            // @ts-ignore
            result = [
              "apply",
              result,
              this.factor({ parse_absolute_value: parse_absolute_value }),
            ];
          }
        }
      } else {
        this.advance();
      }
    } else if (
      this.token.token_type === "(" ||
      this.token.token_type === "[" ||
      this.token.token_type === "{" ||
      this.token.token_type === "LBRACE"
    ) {
      let token_left = this.token.token_type;
      let expected_right, other_right;
      if (this.token.token_type === "(") {
        expected_right = ")";
        other_right = "]";
      } else if (this.token.token_type === "[") {
        expected_right = "]";
        other_right = ")";
      } else if (this.token.token_type === "{") {
        expected_right = "}";
        other_right = null;
      } else {
        expected_right = "RBRACE";
        other_right = null;
      }

      this.advance();
      // @ts-ignore
      result = this.statement_list();

      let n_elements = 1;
      if (result[0] === "list") {
        // @ts-ignore
        n_elements = result.length - 1;
      }

      if (this.token.token_type !== expected_right) {
        if (n_elements !== 2 || other_right === null) {
          throw new ParseError(
            "Expecting " + expected_right,
            this.lexer.location
          );
        } else if (this.token.token_type !== other_right) {
          throw new ParseError("Expecting ) or ]", this.lexer.location);
        }

        // half-open interval
        result[0] = "list";
        // @ts-ignore
        result = ["interval", result];
        let closed;
        if (token_left === "(") closed = ["list", false, true];
        else closed = ["list", true, false];
        // @ts-ignore
        result.push(closed);
      } else if (n_elements >= 2) {
        if (token_left === "(" || token_left === "{") {
          result[0] = "list";
        } else if (token_left === "[") {
          result[0] = "list";
        } else {
          result[0] = "set";
        }
      } else if (token_left === "LBRACE") {
        if (result[0] === "|" || result[0] === ":") {
          // @ts-ignore
          result = ["set", result]; // set builder notation
        } else {
          // @ts-ignore
          result = ["set", result]; // singleton set
        }
      }

      this.advance();
    } else if (
      this.token.token_type[0] === "|" &&
      parse_absolute_value &&
      (inside_absolute_value === 0 ||
        !allow_absolute_value_closing ||
        this.token.token_type[1] === "L")
    ) {
      // allow the opening of an absolute value here if either
      // - we aren't already inside an absolute value (inside_absolute_value==0),
      // - we don't allows an absolute value closing, or
      // - the | was marked as a left
      // otherwise, skip this token so that will drop out the factor (and entire statement)
      // to where the absolute value will close

      inside_absolute_value += 1;

      this.advance();

      result = this.statement({
        inside_absolute_value: inside_absolute_value,
        unknownCommands: unknownCommands,
      });
      // @ts-ignore
      result = ["apply", "abs", result];

      if (this.token.token_type !== "|") {
        throw new ParseError("Expecting |", this.lexer.location);
      }

      this.advance();
    }

    if (this.token.token_type === "_") {
      if (result === false) {
        throw new ParseError("Invalid location of _", this.lexer.location);
      }
      this.advance();
      let subresult = this.baseFactor({
        parse_absolute_value: parse_absolute_value,
      });

      if (subresult === false) {
        // @ts-ignore
        if (this.token.token_type === "EOF") {
          throw new ParseError("Unexpected end of input", this.lexer.location);
        } else {
          throw new ParseError(
            "Invalid location of '" + this.token.original_text + "'",
            this.lexer.location
          );
        }
      }
      return ["_", result, subresult];
    }

    return result;
  }

  leibniz_notation() {
    // attempt to find and return a derivative in Leibniz notation
    // if unsuccessful, return false

    var result = this.token.token_text;

    let deriv_symbol = "";

    let n_deriv = 1;

    let var1 = "";
    let var2s = [];
    let var2_exponents = [];

    if (
      this.token.token_type === "LATEXCOMMAND" &&
      result.slice(1) === "partial"
    )
      deriv_symbol = "∂";
    else if (this.token.token_type === "VAR" && result === "d")
      deriv_symbol = "d";
    else return false;

    // since have just a d or ∂
    // one option is that have a ^ followed by an integer next possibly in {}

    this.advance();

    // @ts-ignore
    if (this.token.token_type === "^") {
      // so far have d or ∂ followed by ^
      // must be followed by an integer
      this.advance();

      let in_braces = false;
      if (this.token.token_type === "{") {
        in_braces = true;

        this.advance();
      }

      if (this.token.token_type !== "NUMBER") {
        return false;
      }

      n_deriv = parseFloat(this.token.token_text);
      if (!Number.isInteger(n_deriv)) {
        return false;
      }

      // found integer,

      // if in braces, require }
      if (in_braces) {
        this.advance();

        if (this.token.token_type !== "}") {
          return false;
        }
      }

      this.advance();
    }

    // since have a d or ∂, optionally followed by ^ and integer
    // next we must have:
    // a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols

    if (this.token.token_type === "VAR") var1 = this.token.token_text;
    // @ts-ignore
    else if (this.token.token_type === "VARMULTICHAR") {
      // strip out name of variable from \var command
      var1 = /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(this.token.token_text)[1];
    } else if (this.token.token_type === "LATEXCOMMAND") {
      result = this.token.token_text.slice(1);
      // @ts-ignore
      if (this.opts.allowedLatexSymbols.includes(result)) var1 = result;
      else return false;
    }

    // Finished numerator.
    // Next need a } and {

    this.advance();

    // @ts-ignore
    if (this.token.token_type !== "}") {
      return false;
    }

    this.advance();

    if (this.token.token_type !== "{") {
      return false;
    } else {
      this.advance();
    }

    // In denominator now
    // find sequence of
    // derivative symbol followed by
    // - a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols
    // optionally followed by a ^ and an integer
    // End when sum of exponents meets or exceeds n_deriv

    let exponent_sum = 0;

    while (true) {
      // next must be
      // - a VAR equal to deriv_symbol="d" or \partial when deriv_symbol = "∂"

      if (
        !(
          (deriv_symbol === "d" &&
            this.token.token_type === "VAR" &&
            this.token.token_text === "d") ||
          (deriv_symbol === "∂" &&
            this.token.token_type === "LATEXCOMMAND" &&
            this.token.token_text.slice(1) === "partial")
        )
      ) {
        return false;
      }

      // followed by
      // - a VAR, a VARMULTICHAR, or a LATEXCOMMAND that is in allowedLatexSymbols

      this.advance();

      if (this.token.token_type === "VAR") var2s.push(this.token.token_text);
      else if (this.token.token_type === "VARMULTICHAR") {
        // strip out name of variable from \var command
        var2s.push(
          /\\var\s*\{\s*([a-zA-Z0-9]+)\s*\}/.exec(this.token.token_text)[1]
        );
      } else if (this.token.token_type === "LATEXCOMMAND") {
        let r = this.token.token_text.slice(1);
        // @ts-ignore
        if (this.allowedLatexSymbols.includes(r)) var2s.push(r);
        else {
          return false;
        }
      } else {
        return false;
      }
      // have derivative and variable, now check for optional ^ followed by number

      let this_exponent = 1;

      this.advance();

      if (this.token.token_type === "^") {
        this.advance();

        let in_braces = false;
        if (this.token.token_type === "{") {
          in_braces = true;

          this.advance();
        }

        if (this.token.token_type !== "NUMBER") {
          return false;
        }

        this_exponent = parseFloat(this.token.token_text);
        if (!Number.isInteger(this_exponent)) {
          return false;
        }

        // if in braces, require }
        if (in_braces) {
          this.advance();

          if (this.token.token_type !== "}") {
            return false;
          }
        }

        this.advance();
      }

      var2_exponents.push(this_exponent);
      exponent_sum += this_exponent;

      if (exponent_sum > n_deriv) {
        return false;
      }

      // possibly found derivative
      if (exponent_sum === n_deriv) {
        // next token must be a }
        if (this.token.token_type !== "}") {
          return false;
        }

        // found derivative!

        this.advance();

        let result_name = "derivative_leibniz";
        if (deriv_symbol === "∂") result_name = "partial_" + result_name;

        // @ts-ignore
        result = [result_name];

        // @ts-ignore
        if (n_deriv === 1) result.push(var1);
        // @ts-ignore
        else result.push(["tuple", var1, n_deriv]);

        let r2 = [];
        for (let i = 0; i < var2s.length; i += 1) {
          if (var2_exponents[i] === 1) r2.push(var2s[i]);
          else r2.push(["tuple", var2s[i], var2_exponents[i]]);
        }
        r2 = ["tuple"].concat(r2);

        // @ts-ignore
        result.push(r2);

        return result;
      }
    }
  }
}
