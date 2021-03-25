module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*.spec.ts",
  modulePathIgnorePatterns: ["old-stuff", "wip-src"],
  reporters: [
    "default",
    [
      "jest-stare",
      {
        resultDir: "docs",
        reportTitle: "test results",
      },
    ],
  ],
};
