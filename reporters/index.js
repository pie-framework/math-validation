class Reporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    console.log(
      "passed",
      results.numPassedTests,
      "out of",
      results.numTotalTests,
      `(${Math.floor((results.numPassedTests / results.numTotalTests) * 100)}%)`
    );
  }

  // onTestResult(t, result) {
  //   if (result.status === "failed") {
  //     console.log("x");
  //   } else {
  //     console.log(".");
  //   }
  //   // console.log(result);
  // }
}

module.exports = Reporter;
