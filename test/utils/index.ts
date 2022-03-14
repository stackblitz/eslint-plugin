import { ESLintUtils } from '@typescript-eslint/utils';

export function ruleTester() {
  return new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
  });
}
