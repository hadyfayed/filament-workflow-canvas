
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [{
  ignores: ['dist/**', 'vendor/**', 'node_modules/**', '**/*.js'],
}, js.configs.recommended, {
  files: ['resources/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      // Browser
      console: 'readonly',
      window: 'readonly',
      document: 'readonly',
      localStorage: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
      HTMLElement: 'readonly',
      HTMLButtonElement: 'readonly',
      HTMLInputElement: 'readonly',
      HTMLTextAreaElement: 'readonly',
      HTMLSelectElement: 'readonly',
      KeyboardEvent: 'readonly',
      Event: 'readonly',
      CustomEvent: 'readonly',
      navigator: 'readonly',
      requestAnimationFrame: 'readonly',
      cancelAnimationFrame: 'readonly',
      getComputedStyle: 'readonly',
      Node: 'readonly',
      // Node.js
      process: 'readonly',
      Buffer: 'readonly',
      global: 'readonly',
      __dirname: 'readonly',
      require: 'readonly',
      NodeJS: 'readonly',
      // Testing
      vi: 'readonly',
      expect: 'readonly',
    },
  },
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    ...tsPlugin.configs.recommended.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-escape': 'warn',
    'no-redeclare': 'off',
    'no-import-assign': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}, prettierConfig];