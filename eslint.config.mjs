import blitzPlugin from '@blitz/eslint-plugin';

export default [
  {
    ignores: ['**/dist', '**/node_modules'],
  },
  ...blitzPlugin.configs.recommended(),
  {
    rules: {
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-require-imports': 0,
    },
  },
];
