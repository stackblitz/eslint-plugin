import tsParser from '@typescript-eslint/parser';
import { TSESLint } from '@typescript-eslint/utils';
import { Linter, RuleTester } from 'eslint';
import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester';
import { run as _run } from 'eslint-vitest-rule-tester';
import * as jsoncParser from 'jsonc-eslint-parser';

export function ruleTester(options: TestCasesOptions & RuleTesterInitOptions) {
  return _run({
    recursive: false,
    verifyAfterFix: false,
    parser: tsParser as Linter.ParserModule,
    ...options,
  });
}

export function ruleTesterForJSONC() {
  return new RuleTester({
    languageOptions: {
      parser: jsoncParser,
    },
  }) as unknown as {
    run<TMessageIds extends string, TOptions extends Readonly<unknown[]>>(
      name: string,
      rule: TSESLint.RuleModule<TMessageIds, TOptions>,
      tests: {
        valid?: Array<string | RuleTester.ValidTestCase> | undefined;
        invalid?: RuleTester.InvalidTestCase[] | undefined;
      },
    ): void;
  };
}
