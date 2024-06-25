import { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

export const jsFileExtensions = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'];

export const jsRules: FlatConfig.Config['rules'] = {
  'consistent-return': 'error',

  'multiline-comment-style': ['error', 'starred-block'],

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

  'no-constant-condition': [
    'error',
    {
      checkLoops: false,
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
      blankLine: 'always',
      prev: 'block',
      next: '*',
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
    {
      blankLine: 'any',
      prev: ['case', 'block', 'block-like'],
      next: ['case', 'default'],
    },
    {
      blankLine: 'any',
      prev: '*',
      next: 'break',
    },
    {
      blankLine: 'always',
      prev: 'if',
      next: '*',
    },
  ],

  '@blitz/block-scope-case': 'error',
  '@blitz/newline-before-return': 'error',
  '@blitz/catch-error-name': 'error',
  '@blitz/comment-syntax': 'error',

  '@blitz/lines-around-comment': [
    'error',
    {
      allowClassStart: true,
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
      allowEnumStart: true,
      allowEnumEnd: true,
      allowTypeStart: true,
      allowTypeEnd: false,
      allowSwitchStart: true,
      allowSwitchEnd: false,
      allowMemberCallExpression: true,
    },
  ],
};
