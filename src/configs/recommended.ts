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

    'no-debugger': 'warn',

    'no-unused-vars': 'off',

    'no-async-promise-executor': 'error',

    'no-case-declarations': 'error',

    'default-case-last': 'error',

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
        next: ['block', 'block-like', 'class', 'const', 'let'],
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
      {
        blankLine: 'any',
        prev: ['export'],
        next: ['export'],
      },
      { blankLine: 'any', prev: '*', next: 'break' },
    ],

    '@typescript-eslint/no-non-null-assertion': 'off',

    '@typescript-eslint/no-empty-function': 'warn',

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

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

    '@typescript-eslint/explicit-module-boundary-types': 'off',

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

    '@blitz/lines-around-comment': [
      'error',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowBlockEnd: false,
        allowObjectStart: true,
        allowObjectEnd: false,
        allowArrayStart: true,
        allowArrayEnd: true,
        allowInterfaceStart: true,
        allowInterfaceEnd: true,
      },
    ],

    '@blitz/block-scope-case': 'error',

    '@blitz/newline-before-return': 'error',
  },
};
