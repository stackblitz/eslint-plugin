import jsRules from '@stylistic/eslint-plugin-ts';
import type { TSESLint } from '@typescript-eslint/utils';

export function getESLintCoreRule(ruleId: keyof typeof jsRules.rules) {
  return jsRules.rules[ruleId] as unknown as TSESLint.RuleModule<any, readonly any[]>;
}
