module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*.spec.ts",
  modulePathIgnorePatterns: ["old-stuff", "wip-src"],
  // reporters: [["./reporters/index.js", { useDots: true }]],
};
