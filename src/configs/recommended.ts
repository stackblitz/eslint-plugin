export = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['@blitz'],
  rules: {
    'consistent-return': 'error',

    curly: ['error', 'all'],

    'dot-notation': 'error',

    'no-unused-vars': 'off',

    'no-async-promise-executor': 'error',

    'no-case-declarations': 'error',

    'default-case-last': 'error',

    'newline-before-return': 'error',

    'no-cond-assign': 'error',

    'no-unneeded-ternary': 'error',

    'object-shorthand': 'error',

    'prefer-arrow-callback': 'error',

    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],

    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: ['block', 'block-like', 'cjs-export', 'class', 'const', 'export', 'let'],
      },
      {
        blankLine: 'never',
        prev: ['block', 'block-like'],
        next: ['case', 'default'],
      },
      {
        blankLine: 'any',
        prev: ['const', 'let'],
        next: ['const', 'let'],
      },
      { blankLine: 'any', prev: '*', next: 'break' },
    ],

    '@typescript-eslint/no-non-null-assertion': 'error',

    '@typescript-eslint/no-unused-vars': 'error',

    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
    ],

    '@typescript-eslint/no-extra-non-null-assertion': 'error',

    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

    '@typescript-eslint/type-annotation-spacing': 'error',

    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
      },
    ],

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': true,
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': false,
      },
    ],

    '@blitz/block-scope-case': 'error',
  },
};
