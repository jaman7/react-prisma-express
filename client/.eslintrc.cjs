const path = require('path');

module.exports = {
  env: {
    browser: true,
    commonj: true,
    es6: true,
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: path.join(__dirname, './tsconfig.json'),
    tsconfigRootDir: './src',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['react', '@typescript-eslint', 'simple-import-sort', 'prettier'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    'valid-typeof': 'off',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: true,
      },
    ],
    'max-classes-per-file': [
      'error',
      {
        ignoreExpressions: true,
        max: 2,
      },
    ],
    '@typescript-eslint/indent': ['error', 2],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'import/extensions': 'off',
    'import/no-named-as-default': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
