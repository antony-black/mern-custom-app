import { defineConfig } from "eslint/config";

import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Ignore node_modules, dist, and declaration files globally
  {
    ignores: ["node_modules/**", "dist/**", "**/*.d.ts"],
  },

  // JavaScript files config
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Node.js globals like process, Buffer, etc.
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
            orderImportKind: "asc",
          },
        },
      ],
      semi: ["error", "always"],
      // quotes: ['error', 'single', { allowTemplateLiterals: true }],
      quotes: ["off", "single", { allowTemplateLiterals: true }],
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    },
  },

  // TypeScript files config
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // Enables type-aware linting
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
            orderImportKind: "asc",
          },
        },
      ],
      // Use base "semi" rule for semicolons (typescript-eslint does not have a separate one)
      semi: ["error", "always"],

      // Disable base ESLint rules that conflict with TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",

      // Enable TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      // Stylistic preferences
      quotes: ["off", "single", { allowTemplateLiterals: true }],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    },
  },
]);
