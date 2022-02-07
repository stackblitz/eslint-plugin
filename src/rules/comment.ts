import { createRule } from '../util';

export const ruleName = 'comment-syntax';

type Options = [];

type MessageIds = 'lineCommentCapital' | 'lineCommentEnding' | 'blockCommentCapital' | 'blockCommentEnding';

export default createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      category: 'Best Practices',
      description: `Enforce block comments to have capital first letter and end with dots and 
      line comments no capital first letter and no dot`,
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      lineCommentCapital: 'A line comment cannot start with a capital letter',
      lineCommentEnding: 'A line comment cannot end with a dot',
      blockCommentCapital: 'A block comment has to start with a capital letter',
      blockCommentEnding: 'A block comment has to end with a dot',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const source = context.getSourceCode();

    const comments = source.getAllComments();

    const isCapital = (char: string) => {
      return char !== char.toLowerCase();
    };

    return {
      Program() {
        for (const comment of comments) {
          if (comment.type === 'Line') {
            // prettier will add a space after the '//' by default so we need the second index
            const firstChar = comment.value[1];
            const lastChar = comment.value[comment.value.length - 1];

            if (isCapital(firstChar)) {
              context.report({ node: comment, messageId: 'lineCommentCapital' });
            }

            if (lastChar === '.') {
              context.report({ node: comment, messageId: 'lineCommentEnding' });
            }

            continue;
          }

          if (comment.type === 'Block') {
            // prettier will add format it so the firstChar is at index 5
            const firstChar = comment.value[5];
            const lastChar = comment.value[comment.value.length - 3];

            if (!isCapital(firstChar)) {
              context.report({ node: comment, messageId: 'blockCommentCapital' });
            }

            if (lastChar !== '.') {
              context.report({ node: comment, messageId: 'blockCommentEnding' });
            }

            continue;
          }
        }
      },
    };
  },
});
