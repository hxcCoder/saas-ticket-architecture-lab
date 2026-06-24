// jest.config.cjs
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  
  // 🌟 NUEVO: Ignoramos las pruebas de integración que requieren base de datos real para el CI
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/infrastructure/persistence/prisma/__tests__/"
  ],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/infrastructure/persistence/prisma/",
    "/src/interfaces/http/",
    "/src/index.ts",
    "src/infrastructure/persistence/services/SubscriptionServiceImpl.ts"
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
          // Se agregó el código '1272' para ignorar el error de decoradores y módulos aislados
          ignoreCodes: ['151002', '1272'], 
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