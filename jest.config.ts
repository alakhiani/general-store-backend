import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  automock: true,
  collectCoverage: false,
  collectCoverageFrom: ['**/src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  maxConcurrency: 5,
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: './coverage',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
};

export default config;
