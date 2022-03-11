export default {
  verbose: true,
  bail: false,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,ts}", "!**/node_modules/**"],
  coverageDirectory: "./coverage",
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],
  moduleFileExtensions: ["js", "ts", "json", "node"],
  testEnvironment: "node",
  testTimeout: 60000,
  coverageProvider: "v8",
  preset: "ts-jest",

  testMatch: [
    "**/*.spec.ts"
  ],
};
