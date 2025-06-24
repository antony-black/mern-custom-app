import { defineConfig } from "eslint/config";

import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "**/*.d.ts"],
  },

  // JS/JSX config
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

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
      quotes: ["off", "single", { allowTemplateLiterals: true }],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "no-irregular-whitespace": ["error", { skipTemplates: true, skipStrings: true }],
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // TS/TSX config
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

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
      quotes: ["off", "single", { allowTemplateLiterals: true }],
      "comma-dangle": ["error", "always-multiline"],
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-unused-vars": "off",
      "no-undef": "off",

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "no-irregular-whitespace": ["error", { skipTemplates: true, skipStrings: true }],
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
