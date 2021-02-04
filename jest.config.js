module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['lib/**/*.{js,jsx}', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  roots: ['test'],
};
