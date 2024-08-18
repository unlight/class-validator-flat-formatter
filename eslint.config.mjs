import 'eslint-plugin-only-warn';

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    ignores: [
      'dist/',
      'coverage/',
      '@generated/**',
      '*.config.[cm]js',
      '.*rc.js',
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: false,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'max-lines': [1, { max: 300 }],
      'max-params': [1, { max: 2 }],
      'no-unneeded-ternary': [1],
    },
  },
  {
    files: ['**/*.spec.[cm]ts', '**/*.e2e-spec.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 0,
      'consistent-return': 0,
      'max-lines': 0,
    },
  },
];
