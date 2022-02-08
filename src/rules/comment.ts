import { createRule } from '../util';

export const ruleName = 'comment-syntax';

type Options = [];

const SPACE_CHARCODE = 32;
const NEWLINE_CHARCODE = 10;
const STAR_CHARCODE = 42;

type MessageIds =
  | 'lineCommentCapital'
  | 'lineCommentEnding'
  | 'blockCommentCapital'
  | 'blockCommentEnding'
  | 'shouldStartWithSpace'
  | 'shouldStartWithBlock';

const isCapital = (char: string) => {
  return char === char.toUpperCase();
};

const isWholeFirstWordCapital = (sentence: string) => {
  for (let char of sentence) {
    if (char.charCodeAt(0) === SPACE_CHARCODE) {
      return true;
    }

    if (!isCapital(char)) {
      return false;
    }
  }

  return true;
};

const isLetter = (char: string) => {
  return char.toLowerCase() !== char.toUpperCase();
};

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
      shouldStartWithSpace: 'A line comment should start with a space',
      shouldStartWithBlock: 'A block comment should start with /**\n *',
      lineCommentCapital: 'A line comment cannot start with a capital letter unless the entire word is capitalised',
      lineCommentEnding: 'A line comment cannot end with a dot',
      blockCommentCapital: 'A block comment has to start with a capital letter',
      blockCommentEnding: 'A block comment has to end with a dot',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      Program() {
        const source = context.getSourceCode();

        const comments = source.getAllComments();

        for (const comment of comments) {
          if (comment.type === 'Line') {
            const secondChar = comment.value[1];
            const lastChar = comment.value[comment.value.length - 1];

            if (comment.value.charCodeAt(0) !== SPACE_CHARCODE) {
              context.report({ node: comment, messageId: 'shouldStartWithSpace' });

              // if this one fails, the others are interpreted incorrectly
              continue;
            }

            if (isLetter(secondChar) && isCapital(secondChar) && !isWholeFirstWordCapital(comment.value.slice(1))) {
              context.report({ node: comment, messageId: 'lineCommentCapital' });
            }

            if (lastChar === '.') {
              context.report({ node: comment, messageId: 'lineCommentEnding' });
            }

            continue;
          }

          if (comment.type === 'Block') {
            const [firstChar, secondChar, thirdChar, fourthChar, fifthChar, sixthChar] = comment.value;
            const lastChar = comment.value[comment.value.length - 3];

            if (
              firstChar.charCodeAt(0) !== STAR_CHARCODE ||
              secondChar.charCodeAt(0) !== NEWLINE_CHARCODE ||
              thirdChar.charCodeAt(0) !== SPACE_CHARCODE ||
              fourthChar.charCodeAt(0) !== STAR_CHARCODE ||
              fifthChar.charCodeAt(0) !== SPACE_CHARCODE
            ) {
              context.report({ node: comment, messageId: 'shouldStartWithBlock' });

              // if this one fails, the others are interpreted incorrectly
              continue;
            }

            if (isLetter(sixthChar) && !isCapital(sixthChar)) {
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
