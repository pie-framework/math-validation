export enum Triage {
  /**
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
  NODE_SORT,

  /**
   * The latex parser is choking on the input things like:
   * (b/x)•a
   * a÷b
   */
  LATEX_PARSE_ERROR,

  /**
   * percent not converting to mathjs.
   * We had this working in the legacy set up so may just need to update
   * ast => mathjs conversion logic
   */
  PERCENT_SUPPORT,

  /**
   *  multiply every term within the parentheses by the factor outside
   * of the parentheses does not work if we have more than one factor and we want to multiply
   * the terms in parantheses with only one factor
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

}
