import { ESLintUtils } from '@typescript-eslint/utils';

const version = require('../../package.json').version;

export const createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/stackblitz/eslint-plugin/blob/v${version}/docs/rules/${name}.md`;
});
