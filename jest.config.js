module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  reporters: [["jest-silent-reporter", { useDots: true }]],
};
