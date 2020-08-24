import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export const ruleName = 'block-scope-case';

export const messageId = 'default';

export default ESLintUtils.RuleCreator((ruleName) => ruleName)({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      category: 'Best Practices',
      description: 'Ensures all case statements are block scoped',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]: 'Case statements must be block scoped.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      SwitchCase: (node) => {
        if (node.consequent[0].type !== 'BlockStatement') {
          context.report({
            node,
            loc: {
              column: node.loc.start.column + (node.test ? 'case'.length : 'default'.length),
              line: node.loc.start.line,
            },
            messageId: 'default',
          });
        }
      },
    };
  },
});
