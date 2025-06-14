// import js from '@eslint/js';
// import react from 'eslint-plugin-react';
// import reactHooks from 'eslint-plugin-react-hooks';
// import reactRefresh from 'eslint-plugin-react-refresh';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   { ignores: ['dist', 'node_modules'] },

//   // Base config for all JS/TS files
//   {
//     files: ['**/*.{js,jsx,ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       sourceType: 'module',
//       globals: globals.browser,
//     },
//     plugins: {
//       react,
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...react.configs.recommended.rules,
//       ...reactHooks.configs.recommended.rules,
//       'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
//       'react/react-in-jsx-scope': 'off',
//     },
//     settings: {
//       react: {
//         version: 'detect',
//       },
//     },
//   },

//   // TS-specific overrides
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: tseslint.configs.recommended,
//   },
// );
// eslint.config.js
// import eslint from '@eslint/js';
// import reactPlugin from 'eslint-plugin-react';
// import reactHooksPlugin from 'eslint-plugin-react-hooks';
// import { defineConfig } from 'eslint/config';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export default defineConfig([
//   {
//     ignores: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts'],
//   },

//   // JS/JSX config
//   {
//     files: ['**/*.js', '**/*.jsx'],
//     languageOptions: {
//       ecmaVersion: 'latest',
//       sourceType: 'module',
//       globals: {
//         ...globals.browser,
//         ...globals.es2024,
//       },
//       parserOptions: {
//         project: './tsconfig.json',
//       },
//     },
//     plugins: {
//       react: reactPlugin,
//       'react-hooks': reactHooksPlugin,
//     },
//     rules: {
//       ...eslint.configs.recommended.rules,
//       ...reactPlugin.configs.recommended.rules,
//       ...reactHooksPlugin.configs.recommended.rules,

//       semi: ['error', 'always'],
//       quotes: ['error', 'single', { allowTemplateLiterals: true }],
//       'comma-dangle': ['error', 'always-multiline'],
//       'no-console': 'warn',

//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//     },
//     settings: {
//       react: { version: 'detect' },
//     },
//   },

//   // TS/TSX config
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//     languageOptions: {
//       parser: tseslint.parser,
//       parserOptions: {
//         project: './tsconfig.json',
//         tsconfigRootDir: __dirname,
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         ecmaFeatures: { jsx: true },
//       },
//       globals: {
//         ...globals.browser,
//         ...globals.es2024,
//       },
//     },
//     plugins: {
//       '@typescript-eslint': tseslint.plugin,
//       react: reactPlugin,
//       'react-hooks': reactHooksPlugin,
//     },
//     rules: {
//       semi: ['error', 'always'],
//       'no-unused-vars': 'off',
//       'no-undef': 'off',
//       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/explicit-function-return-type': 'off',

//       ...reactPlugin.configs.recommended.rules,
//       ...reactHooksPlugin.configs.recommended.rules,

//       quotes: ['error', 'single', { allowTemplateLiterals: true }],
//       'comma-dangle': ['error', 'always-multiline'],
//       'no-console': 'warn',

//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//     },
//     settings: {
//       react: { version: 'detect' },
//     },
//   },
// ]);
// eslint.config.js
// =============================================
// import eslint from '@eslint/js';
// import reactPlugin from 'eslint-plugin-react';
// import reactHooksPlugin from 'eslint-plugin-react-hooks';
// import { defineConfig } from 'eslint/config';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// // ⬇️ Fix for __dirname in ESM context
// // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export default defineConfig([
//   {
//     ignores: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts'],
//   },

//   // JS/JSX config
//   {
//     files: ['**/*.js', '**/*.jsx'],
//     languageOptions: {
//       ecmaVersion: 'latest',
//       sourceType: 'module',
//       globals: {
//         ...globals.browser,
//         ...globals.es2024,
//       },
//     },
//     plugins: {
//       react: reactPlugin,
//       'react-hooks': reactHooksPlugin,
//     },
//     rules: {
//       ...eslint.configs.recommended.rules,
//       ...reactPlugin.configs.recommended.rules,
//       ...reactHooksPlugin.configs.recommended.rules,

//       semi: ['error', 'always'],
//       quotes: ['error', 'single', { allowTemplateLiterals: true }],
//       'comma-dangle': ['error', 'always-multiline'],
//       'no-console': 'warn',
//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//     },

//     settings: {
//       react: { version: 'detect' },
//     },
//   },

//   // TS/TSX config
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//     languageOptions: {
//       parser: tseslint.parser,
//       parserOptions: {
//         // project: path.resolve(__dirname, './tsconfig.app.json'),
//         project: ['./tsconfig.app.json', './tsconfig.node.json'],
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         ecmaFeatures: { jsx: true },
//       },
//       globals: {
//         ...globals.browser,
//         ...globals.es2024,
//       },
//     },
//     plugins: {
//       '@typescript-eslint': tseslint.plugin,
//       react: reactPlugin,
//       'react-hooks': reactHooksPlugin,
//     },
//     rules: {
//       ...reactPlugin.configs.recommended.rules,
//       ...reactHooksPlugin.configs.recommended.rules,

//       semi: ['error', 'always'],
//       quotes: ['error', 'single', { allowTemplateLiterals: true }],
//       'comma-dangle': ['error', 'always-multiline'],
//       'no-console': 'error',
//       'no-unused-vars': 'off',
//       'no-undef': 'off',
//       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/explicit-function-return-type': 'off',
//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//     },
//     settings: {
//       react: { version: 'detect' },
//     },
//   },
// ]);
// ==============================================

import { defineConfig } from 'eslint/config';

import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts'],
  },

  // JS/JSX config
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // TS/TSX config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],

      semi: ['error', 'always'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]);
