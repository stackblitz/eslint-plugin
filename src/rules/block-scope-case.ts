import { createRule } from '../util';

export const ruleName = 'block-scope-case';

export const messageId = 'default';

export default createRule({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      description: 'Ensures all case statements are block scoped',
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
        if (node.consequent.length > 0 && node.consequent[0].type !== 'BlockStatement') {
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
