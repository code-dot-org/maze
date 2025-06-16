import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.ts?(x)"],
  transform: {
    "^.+\\.tsx?$": ['@swc/jest', { sourceMaps: true, }],
  },
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  testEnvironmentOptions: {
    url: "http://localhost:8080"
  },
};

export default config;
