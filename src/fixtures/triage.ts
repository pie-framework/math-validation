export enum Triage {
  /**
   * Mathjs is not sorting the nodes in the AST as we would expect.
   * so a+b == b+a
   */
  NODE_SORT,

  /**
   * The latex parser is choking on the input things like:
   * (b/x)•a
   */
  LATEX_PARSE_ERROR,

  /**
   * percent not converting to mathjs.
   * We had this working in the legacy set up so may just need to update
   * ast => mathjs conversion logic
   */
  PERCENT_SUPPORT,
}
