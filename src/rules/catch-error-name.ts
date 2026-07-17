import { createRule } from '../util';

export const ruleName = 'catch-error-name';

export const messageId = 'default';

type Options = [
  {
    name: string;
    ignore: string[];
  },
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
      description: 'Enforce a specific parameter name in catch clauses',
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
              fix: (fixer) => {
                if (!node.param) {
                  return null;
                }

                // renaming would conflict with an existing usage of the expected name
                if (new RegExp(`\\b${expectedName}\\b`).test(context.sourceCode.getText(node.body))) {
                  return null;
                }

                const variable = context.sourceCode
                  .getDeclaredVariables(node)
                  .find(({ name }) => name === originalName);

                const references = variable?.references.map(({ identifier }) => identifier) ?? [];

                return [node.param, ...references].map((identifier) => fixer.replaceText(identifier, expectedName));
              },
            });
          }
        }
      },
    };
  },
});
