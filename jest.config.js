/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/__mocks__/styleMock.js',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/fileMock.js',
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'jest-junit-report.xml' }],
  ],
};
