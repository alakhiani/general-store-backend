import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  automock: false, // Dangerous, be very careful with using this, all imported modules will be automatically mocked, perhaps even the one you are trying to test and need the real workflow
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.spec.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 50,
      statements: 50,
    },
  },
  maxConcurrency: 5,
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: './coverage',
  testRegex: '(/__tests__/.*\\.ts)$',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ]
};

export default config;
