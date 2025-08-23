import baseConfig from "../jest.config.js";

/** @type {import('jest').Config} */
export default {
  ...baseConfig,
  // testEnvironment: "jsdom", // frontend needs DOM-like env
  // roots: ["<rootDir>/src"],
};
