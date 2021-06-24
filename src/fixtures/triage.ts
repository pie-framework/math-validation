export enum Triage {
  /**
   * difference between fraction and divide expression?
   *
   */

  /**
   *  multiply every term within the parenthesis by the factor outside
   * of the parenthesis does not work if we have more than one factor and we want to multiply
   * the terms in paranthesis with only one factor
   * ab(x+y) it won't be equal with a(bx+by)
   */
  DISTRIBUTIVE_PROPERTY,

  /**
   * Identity property of multiplication: The product of 1 and any number is that number
   *(c-by)/a) != 1/a*c -1/a*by
   */
  IDENTITY_PROPERTY,

  /**
   * multiply with a common factor
   * -(b/m) != b/(-m)
   */
  COMMON_FACTOR,

  /**
   * Expand a fraction with common denominator will not work
   * (c-by)/a) != c/a-by/a
   */
  COMMON_DENOMINATOR,

  /**
   * Distributive Property of Multiplication over Addition
   * Associative Property
   * expanding the fraction should be valid
   * 3V/B != 3*(V/B)
   */
  FRACTIONS_PROPERTIES,

  /**
   * We don't parse inverse functions
   */
  INVERSE_FUNCTIONS,

  /**
   * Rationalize expressions inside functions
   */
  FUNCTION_RATIONALIZE,

  /**
   * ml should be eq with mL
   * ALSO I SHOULD CHECK OTHER UNITS
   */
  MEASUREMENT_UNITS,

  // DONE

  /** Done - I got it wrong, this was not a parenthesis error -> it was about sorting an operator node
   * something goes wrong when striping parenthesis
   */
  PARENTHESIS,

  /**  Done
   * A user can randomly punch any old input to be evaluated.
   * If this input is of a sufficient length it can cause the function to stall.
   * We need to identify this input before we run through the evaluator.
   */
  BAD_USER_INPUT,

  /** Done
   * percent not converting to mathjs.
   * _underscore not implemented for conversion to mathjs
   * We had this working in the legacy set up so may just need to update
   * ast => mathjs conversion logic
   */
  PERCENT_SUPPORT,

  /** Done
   * The latex parser is choking on the input things like:
   * (b/x)•a
   * a÷b
   * Invalid symblol '×'
   * Invalid symblol '≤'
   */
  LATEX_PARSE_ERROR,

  /** Done
   * sqrt(x) should be eq with sqrt{2}(x)
   * log x should be eq with log{10}(x)
   * ln(x) should be eq with log{e}(x)
   */
  EQUIVALENT_FUNCTIONS,

  // Done
  ALLOW_TRAILING_ZEROS_SYMBOLIC,

  /** Done
   * Invalid location of '='
   *  for an expression like "text{whatever} = 5", text{whatever} was treated like an empty space therefore it was removed. the remaining "= 5" is not a valid expression
   */
  EQUAL_LOCATION_PARSE_ERROR,

  /** Done
   * allow applied functions to omit parentheses around argument
   * expecting ( after function
   */
  EXPECTING_PARANTHESIS,

  /** Done
   * Unimplemented node type in simplifyConstant: RelationalNode
   */
  UNIMPLEMENTED_NODE,

  /** Done - this was a parsing error
   * TypeError: Cannot implicitly convert a number to a Fraction when there will be a loss of precision (value: 0.31426968052735443).
   * Use function fraction(x) to convert to Fraction.
   */
  FRACTION_CONVERSION_ERROR,

  /** Done
   * Mathjs is not sorting the nodes in the AST as we would expect.
   * commutative pproperties of opperations are ignored
   * so a+b !== b+a
   * ab !== ba
   * ab !== bxa
   * ab !== b*a
   * ab !== (b)a
   * ab !== b(a)
   * ab !== (b)(a)
   */
  NODE_SORT_SYMBOLIC,

  /**
   * _underscore not implemented for conversion to mathjs
   */
  UNDERSCORE_SUPPORT,
}
