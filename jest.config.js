module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*.spec.ts",
  modulePathIgnorePatterns: ["old-stuff", "wip-src"],
  // reporters: [["./reporters/index.js", { useDots: true }]],
  reporters: [
    "default",
    [
      "jest-stare",
      {
        resultDir: "docs",
        reportTitle: "test results",
        // additionalResultsProcessors: ["jest-junit"],
        // coverageLink: "../../coverage/lcov-report/index.html",
        // jestStareConfigJson: "jest-stare.json",
        // jestGlobalConfigJson: "globalStuff.json",
      },
    ],
  ],
};
