// import tsPlugin from '@typescript-eslint/eslint-plugin';

// export default tseslint.config(
//   {
//     ignores: ['dist', 'node_modules'],
//   },
//   {
//     files: ['**/*.ts'],
//     languageOptions: {
//       ecmaVersion: 2022,
//       sourceType: 'module',
//       globals: {
//         ...globals.node,
//       },
//     },
//     plugins: {
//       n: nodePlugin,
//       prettier: prettierPlugin,
//       '@typescript-eslint': tsPlugin, // Add this line
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...tseslint.configs.recommended[0].rules,
//       ...tseslint.configs.recommended[1].rules,
//       ...nodePlugin.configs['recommended'].rules,

//       'n/no-missing-import': 'error',
//       'n/no-unsupported-features/es-syntax': 'off',
//       'no-console': 'warn',
//       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

//       'prettier/prettier': 'error',
//     },
//   },
// );

// eslint.config.js
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Ignore node_modules, dist, and declaration files globally
  {
    ignores: ['node_modules/**', 'dist/**', '**/*.d.ts'],
  },

  // JavaScript files config
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // Node.js globals like process, Buffer, etc.
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'no-console': 'warn',
    },
  },

  // TypeScript files config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // Enables type-aware linting
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Use base "semi" rule for semicolons (typescript-eslint does not have a separate one)
      semi: ['error', 'always'],

      // Disable base ESLint rules that conflict with TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // Enable TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Stylistic preferences
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-console': 'warn',
    },
  },
]);
