import { RuleTester } from 'eslint';
import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';

export function ruleTester() {
  return new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
  });
}

export function ruleTesterForJSONC() {
  return new RuleTester({
    parser: require.resolve('jsonc-eslint-parser'),
  }) as unknown as {
    run<TMessageIds extends string, TOptions extends Readonly<unknown[]>>(
      name: string,
      rule: TSESLint.RuleModule<TMessageIds, TOptions>,
      tests: {
        valid?: Array<string | RuleTester.ValidTestCase> | undefined;
        invalid?: RuleTester.InvalidTestCase[] | undefined;
      }
    ): void;
  };
}
