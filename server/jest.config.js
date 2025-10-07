export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/tests/**',
  ],
  coverageReporters: ['text', 'lcov', 'json', 'clover'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^\.\./middleware/(.*)\.js$': '<rootDir>/src/middleware/$1.ts',
    '^\.\./controllers/(.*)\.js$': '<rootDir>/src/controllers/$1.ts',
    '^\.\./services/(.*)\.js$': '<rootDir>/src/services/$1.ts',
    '^\.\./models/(.*)\.js$': '<rootDir>/src/models/$1.ts',
    '^\.\./utils/(.*)\.js$': '<rootDir>/src/utils/$1.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext'
        }
      }
    ]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};


