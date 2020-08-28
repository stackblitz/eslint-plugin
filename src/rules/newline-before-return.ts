import { TSESTree } from '@typescript-eslint/experimental-utils';
import { oneLine } from 'common-tags';
import { createRule } from '../util';

export const ruleName = 'newline-before-return';

export const messageId = 'default';

export default createRule({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      category: 'Stylistic Issues',
      description: oneLine`
        Require an empty line before 'return' statements, only for block statemenet with more than 2 nodes
      `,
      recommended: 'error',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      [messageId]: 'Expected newline before return statement.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();

    function calcCommentLines(node: TSESTree.Node, lineNumTokenBefore: number) {
      const comments = sourceCode.getCommentsBefore(node);
      let numLinesComments = 0;

      if (!comments.length) {
        return numLinesComments;
      }

      comments.forEach((comment) => {
        numLinesComments++;

        if (comment.type === 'Block') {
          numLinesComments += comment.loc.end.line - comment.loc.start.line;
        }

        // avoid counting lines with inline comments twice
        if (comment.loc.start.line === lineNumTokenBefore) {
          numLinesComments--;
        }

        if (comment.loc.end.line === node.loc.start.line) {
          numLinesComments--;
        }
      });

      return numLinesComments;
    }

    function hasNewlineBefore(node: TSESTree.Node) {
      const lineNumNode = node.loc.start.line;
      const lineNumTokenBefore = getLineNumberOfTokenBefore(node);
      const commentLines = calcCommentLines(node, lineNumTokenBefore);

      return lineNumNode - lineNumTokenBefore - commentLines > 1;
    }

    function getLineNumberOfTokenBefore(node: TSESTree.Node) {
      const tokenBefore = sourceCode.getTokenBefore(node);
      let lineNumTokenBefore;

      /**
       * Global return (at the beginning of a script) is a special case.
       * If there is no token before `return`, then we expect no line
       * break before the return. Comments are allowed to occupy lines
       * before the global return, just no blank lines.
       * Setting lineNumTokenBefore to zero in that case results in the
       * desired behavior.
       */
      if (tokenBefore) {
        lineNumTokenBefore = tokenBefore.loc.end.line;
      } else {
        lineNumTokenBefore = 0; // global return at beginning of script
      }

      return lineNumTokenBefore;
    }

    return {
      ReturnStatement: (node) => {
        const block = node.parent;

        if (!block || block.type !== 'BlockStatement') {
          return;
        }

        if (!block.body.length || block.body.length <= 2 || hasNewlineBefore(node)) {
          return;
        }

        context.report({
          node,
          messageId: 'default',
          suggest: [
            {
              messageId,
              fix(fixer) {
                const tokenBefore = sourceCode.getTokenBefore(node);

                if (!tokenBefore) {
                  return null;
                }

                const newlines = node.loc.start.line === tokenBefore.loc.end.line ? '\n\n' : '\n';

                return fixer.insertTextAfter(tokenBefore, newlines);
              },
            },
          ],
        });
      },
    };
  },
});
