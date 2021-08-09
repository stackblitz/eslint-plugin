import { createRule } from '../util';

export const ruleName = 'catch-error-name';

export const messageId = 'default';

type Options = [
  {
    name: string;
    ignore: string[];
  }
];

export const defaultOptions: Options = [
  {
    name: 'error',
    ignore: [],
  },
];

type MessageIds = typeof messageId;

export default createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Enforce a specific parameter name in catch clauses',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          ignore: {
            type: 'array',
            uniqueItems: true,
          },
        },
      },
    ],
    messages: {
      default: 'The catch parameter `{{originalName}}` should be named `{{fixedName}}`.',
    },
  },
  defaultOptions,
  create: (context, [options]) => {
    return {
      CatchClause: (node) => {
        const expectedName = options.name;

        if (node.param && node.param.type === 'Identifier') {
          const { name: originalName } = node.param;

          if (originalName !== expectedName && !options.ignore.some((ignored: string) => originalName === ignored)) {
            context.report({
              node,
              messageId: 'default',
              data: {
                originalName,
                fixedName: expectedName,
              },
            });
          }
        }
      },
    };
  },
});
