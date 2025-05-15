/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
    preset: 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.ts'],
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitleReport": "Test Report",
      "outputPath": "test-report.html",
      "pageTitle": "Scheduled Selenium Test Report"
    }]
  ]
};