// jest.config.ts
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optionally include extra setup
  moduleNameMapper: {
    // Handle module aliases (this will match what's in tsconfig.json)
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};

export default createJestConfig(customJestConfig);
