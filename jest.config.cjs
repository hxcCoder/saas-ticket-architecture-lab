/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  
  // Ignoramos las pruebas de integración que requieren base de datos real para el CI
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/infrastructure/persistence/prisma/__tests__/"
  ],

  // Excluimos del reporte de cobertura los archivos de infraestructura y puntos de entrada
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/infrastructure/persistence/prisma/",
    "<rootDir>/src/interfaces/http/",
    "<rootDir>/src/index.ts",
    "<rootDir>/src/infrastructure/persistence/services/SubscriptionServiceImpl.ts"
  ],

  moduleFileExtensions: ["ts", "js"],
  clearMocks: true,
  maxWorkers: 1,

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
        diagnostics: {
          ignoreCodes: ['151002'],
        },
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          esModuleInterop: true
        }
      },
    ],
  },

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/generated/**",
    "!src/**/*.test.ts",
    "!src/**/test/**",
    "!src/infrastructure/config/**",
    "!src/infrastructure/persistence/prisma/__tests__/**"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
};