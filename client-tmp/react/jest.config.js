module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  watchPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
};