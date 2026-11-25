import stylistic from '@stylistic/eslint-plugin';
import type { TSESLint } from '@typescript-eslint/utils';

export function getESLintCoreRule(ruleId: keyof typeof stylistic.rules) {
  return stylistic.rules[ruleId] as unknown as TSESLint.RuleModule<any, readonly any[]>;
}
