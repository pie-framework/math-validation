class Reporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }
  /** 
  readonly onTestResult?: (
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult,
  ) => Promise<void> | void;
  readonly onTestFileResult?: (
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult,
  ) => Promise<void> | void;
  readonly onTestCaseResult?: (
    test: Test,
    testCaseResult: TestCaseResult,
  ) => Promise<void> | void;
  readonly onRunStart: (
    results: AggregatedResult,
    options: ReporterOnStartOptions,
  ) => Promise<void> | void;
  readonly onTestStart?: (test: Test) => Promise<void> | void;
  readonly onTestFileStart?: (test: Test) => Promise<void> | void;
  readonly onRunComplete: (
    contexts: Set<Context>,
    results: AggregatedResult,
  ) => Promise<void> | void;
  readonly getLastError: () => Error | void;
  */

  onRunComplete(contexts, results) {
    console.log(
      "passed",
      results.numPassedTests,
      "out of",
      results.numTotalTests,
      `(${Math.floor((results.numPassedTests / results.numTotalTests) * 100)}%)`
    );
  }

  onTestStart(t) {
    console.log("start", Object.keys(t));
  }
  onTestCaseResult(t, result) {
    console.log(Object.keys(t));
  }
  onTestResult(t, result) {
    console.log("t:", Object.keys(t));
    console.log("result", Object.keys(result));
    if (result.status === "failed") {
      console.log("x");
    } else {
      console.log(".");
    }
    // console.log(result);
  }
}

module.exports = Reporter;
