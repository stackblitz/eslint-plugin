import { createRule } from '../util';

export const ruleName = 'comment-syntax';

type Options = [
  {
    ignoredWords: string[];
  }
];

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

const isWholeFirstWordCapitalOrAllowed = (sentence: string, allowedWords: string[]) => {
  let firstWord = '';
  let isWordCapital = true;

  for (const char of sentence) {
    if (char?.charCodeAt(0) === SPACE_CHARCODE || !isLetter(char)) {
      break;
    }

    if (isLetter(char)) {
      firstWord += char;
    }

    if (!isCapital(char)) {
      isWordCapital = false;
    }
  }

  if (isWordCapital) {
    return true;
  }

  if (allowedWords.includes(firstWord)) {
    return true;
  }

  return false;
};

const isLetter = (char: string) => {
  return char && char.toLowerCase() !== char.toUpperCase();
};

const isJsDoc = (comment: string) => {
  return (
    comment.includes('@param') ||
    comment.includes('@return') ||
    comment.includes('@deprecated') ||
    comment.includes('@see')
  );
};

const isRegion = (comment: string) => {
  return comment.startsWith('#region') || comment.startsWith('#endregion');
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
    schema: [
      {
        type: 'object',
        properties: {
          ignoredWords: {
            type: 'array',
            uniqueItems: true,
            description: 'determines which words line comments can start with that have a capital letter',
          },
        },
      },
    ],
    messages: {
      shouldStartWithSpace: 'A line comment should start with a space',
      shouldStartWithBlock: 'A block comment should start with /**\n *',
      lineCommentCapital: 'A line comment cannot start with a capital letter unless the entire word is capitalised',
      lineCommentEnding: 'A line comment cannot end with a dot',
      blockCommentCapital: 'A block comment has to start with a capital letter',
      blockCommentEnding: 'A block comment has to end with a dot',
    },
  },
  defaultOptions: [
    {
      ignoredWords: [],
    },
  ],
  create: (context, [{ ignoredWords }]) => {
    return {
      Program() {
        const source = context.getSourceCode();

        const comments = source.getAllComments();

        for (const comment of comments) {
          if (comment.type === 'Line') {
            const secondChar = comment.value[1];
            const lastChar = comment.value[comment.value.length - 1];

            if (comment.value?.charCodeAt(0) !== SPACE_CHARCODE && !isRegion(comment.value)) {
              context.report({ node: comment, messageId: 'shouldStartWithSpace' });

              // if this one fails, the others are interpreted incorrectly
              continue;
            }

            if (
              isLetter(secondChar) &&
              isCapital(secondChar) &&
              !isWholeFirstWordCapitalOrAllowed(comment.value.slice(1), ignoredWords)
            ) {
              context.report({ node: comment, messageId: 'lineCommentCapital' });
            }

            if (lastChar === '.') {
              context.report({ node: comment, messageId: 'lineCommentEnding' });
            }

            continue;
          }

          if (comment.type === 'Block') {
            if (!comment.value.includes('\n')) {
              // single line block comments are ignored
              continue;
            }

            const [firstChar] = comment.value;
            let numberOfSpaces = 0;

            // verify the first char is a '*'
            if (firstChar.charCodeAt(0) !== STAR_CHARCODE) {
              context.report({ node: comment, messageId: 'shouldStartWithBlock' });

              continue;
            }

            const commentWithoutFirstStar = comment.value.slice(1);

            for (const char of commentWithoutFirstStar) {
              if (char.charCodeAt(0) === STAR_CHARCODE) {
                // should be the newline
                const firstChar = commentWithoutFirstStar[0];

                // should be the star
                const secondChar = commentWithoutFirstStar[numberOfSpaces + 1];

                // should be a space
                const thirdChar = commentWithoutFirstStar[numberOfSpaces + 2];

                // First actual character
                const fourthChar = commentWithoutFirstStar[numberOfSpaces + 3];

                if (
                  firstChar?.charCodeAt(0) !== NEWLINE_CHARCODE ||
                  secondChar?.charCodeAt(0) !== STAR_CHARCODE ||
                  thirdChar?.charCodeAt(0) !== SPACE_CHARCODE
                ) {
                  context.report({ node: comment, messageId: 'shouldStartWithBlock' });

                  // if this one fails, the others are interpreted incorrectly
                  break;
                }

                const actualText = commentWithoutFirstStar.slice(numberOfSpaces + 3);

                if (
                  isLetter(fourthChar) &&
                  !(isCapital(fourthChar) || isWholeFirstWordCapitalOrAllowed(actualText, ignoredWords))
                ) {
                  context.report({ node: comment, messageId: 'blockCommentCapital' });
                }

                break;
              }

              if (![SPACE_CHARCODE, NEWLINE_CHARCODE].includes(char.charCodeAt(0))) {
                context.report({ node: comment, messageId: 'shouldStartWithBlock' });

                break;
              } else if (char.charCodeAt(0) === SPACE_CHARCODE) {
                numberOfSpaces++;
              }
            }

            const secondLastChar = comment.value[comment.value.length - 4];
            const lastChar = comment.value[comment.value.length - 3];

            if (!isJsDoc(comment.value) && isLetter(secondLastChar) && isLetter(lastChar) && lastChar !== '.') {
              context.report({ node: comment, messageId: 'blockCommentEnding' });
            }

            continue;
          }
        }
      },
    };
  },
});
