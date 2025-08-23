/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  // testEnvironment: 'jsdom', // frontend often needs DOM-like environment
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/src/$1', // maps @shared/*
    '^@/(.*)$': '<rootDir>/src/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^store/(.*)$': '<rootDir>/src/store/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      isolatedModules: true,
      babelConfig: false,
    },
  },
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // optional, for jest-dom etc.
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
};
