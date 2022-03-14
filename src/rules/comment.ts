import { createRule } from '../util';
import { oneLine } from '../util/messages';

export const ruleName = 'comment-syntax';

export const defaultOptions = {
  ignoredWords: [] as string[],
  allowedParagraphEndings: ['.', ':', '`', ')', '}', ']', ';'],
};

type Options = [(typeof defaultOptions | undefined)?];

const SPACE_CHARCODE = 32;
const STAR = '*';
const BLOCK_COMMENT_END = /^\s*$/;
const EMPTY_BLOCK_COMMENT_LINE = /^\s*\*$/;
const CODE_BLOCK = /^\s*\*\s+```/;
const BLOCK_COMMENT_LINE_START = /^\s*\*\s+.*/;
const JS_DOC_REGEX = /^\s*\*\s*@.+?/;
const LIST_ITEM = /^\s*\*\s*(?:-|\d\.)/;

const LINE_INFO = '\n\nLine: {{line}}';

type MessageIds =
  | 'lineCommentCapital'
  | 'lineCommentEnding'
  | 'paragraphCapitalized'
  | 'shouldStartWithSpace'
  | 'shouldStartWithBlock'
  | 'shouldEndWithBlock'
  | 'noSpaceBeforeEnd'
  | 'spaceBeforeJSDoc'
  | 'shouldEndWithDot'
  | 'invalidListItem'
  | 'invalidBlockCommentLine'
  | 'invalidParagraphEnding';

function isCapital(char: string) {
  return char != null && char === char.toUpperCase();
}

function isLetter(char: string) {
  return /\w/.test(char);
}

function isCapitalizedOrAllowed(text: string, ignoredWords: string[]) {
  let firstWord = '';
  let isWordCapital = true;

  for (const char of text) {
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

  if (ignoredWords.includes(firstWord)) {
    return true;
  }

  return false;
}

const isRegion = (comment: string) => {
  return comment.startsWith('#region') || comment.startsWith('#endregion');
};

export default createRule<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    docs: {
      description: oneLine`Enforce block comments to start with a capital first letter and end with a dot and
        line comments to not start with a capital first letter and no dot
      `,
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
            description: 'Determines which words do not have to be capitalized',
            default: defaultOptions.ignoredWords,
          },
          allowedParagraphEndings: {
            type: 'array',
            uniqueItems: true,
            description: 'Specifies the characters that can be used to end a paragraph',
            default: defaultOptions.allowedParagraphEndings,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      shouldStartWithSpace: 'Line comment should start with a space.',
      shouldStartWithBlock: 'Block comment should start with `/**\\n *`.',
      lineCommentCapital: 'Line comment cannot start with a capital letter unless the entire word is capitalized.',
      lineCommentEnding: 'Line comment cannot end with a dot.',
      paragraphCapitalized: `Paragraph should start with a capital letter.${LINE_INFO}`,
      shouldEndWithDot: `Paragraph should end with a dot.${LINE_INFO}`,
      shouldEndWithBlock: 'Block comment should end with `\\n*/`.',
      noSpaceBeforeEnd: 'Block comment should not end with an empty line.',
      invalidListItem: `List item requires a space at the beginning.${LINE_INFO}`,
      invalidParagraphEnding: `Paragraph should end with one of {{allowedParagraphEndings}}.${LINE_INFO}`,
      invalidBlockCommentLine: `Each line in a block comment requires a space after '*'.${LINE_INFO}`,
      spaceBeforeJSDoc: `Requires newline before JSDocs.${LINE_INFO}`,
    },
  },
  defaultOptions: [defaultOptions],
  create: (context, [options]) => {
    return {
      Program() {
        const { ignoredWords, allowedParagraphEndings } = { ...defaultOptions, ...options };

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
              !isCapitalizedOrAllowed(comment.value.slice(1), ignoredWords)
            ) {
              context.report({ node: comment, messageId: 'lineCommentCapital' });
            }

            if (lastChar === '.') {
              context.report({ node: comment, messageId: 'lineCommentEnding' });
            }

            continue;
          }

          if (comment.type === 'Block') {
            let lines = comment.value.split('\n');

            if (lines.length <= 1) {
              // single line block comments are ignored
              continue;
            }

            // verify the first char is a '*'
            if (lines[0] !== STAR) {
              context.report({ node: comment, messageId: 'shouldStartWithBlock' });
              continue;
            }

            lines = lines.slice(1);

            let newParagraph = true;
            let insideCodeBlock = false;
            let jsdocContinuation = false;

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const lineData = { line: line.trim() };
              const prevLine = lines[i - 1];
              const nextLine = lines[i + 1];
              const isLastContentLine = BLOCK_COMMENT_END.test(nextLine);
              const isLastLine = i === lines.length - 1;
              const isCurrentLineEmpty = EMPTY_BLOCK_COMMENT_LINE.test(line);
              const isNextLineEmpty = EMPTY_BLOCK_COMMENT_LINE.test(nextLine);
              const isCurrentLineJSDoc = JS_DOC_REGEX.test(line);
              const isNextLineCodeBlock = CODE_BLOCK.test(nextLine);
              const isListItem = LIST_ITEM.test(line);
              const nextLineNotEmptyOrEnd = !isNextLineEmpty && !isLastContentLine;

              if (isLastLine) {
                if (!BLOCK_COMMENT_END.test(line)) {
                  context.report({ node: comment, messageId: 'shouldEndWithBlock' });
                  break;
                }

                if (EMPTY_BLOCK_COMMENT_LINE.test(prevLine)) {
                  context.report({ node: comment, messageId: 'noSpaceBeforeEnd' });
                  break;
                }

                continue;
              }

              if (CODE_BLOCK.test(line)) {
                if (insideCodeBlock) {
                  insideCodeBlock = false;
                  newParagraph = true;

                  continue;
                }

                insideCodeBlock = true;

                continue;
              }

              if (isCurrentLineJSDoc) {
                if (prevLine && !EMPTY_BLOCK_COMMENT_LINE.test(prevLine) && !JS_DOC_REGEX.test(prevLine)) {
                  context.report({ node: comment, messageId: 'spaceBeforeJSDoc', data: { ...lineData } });
                  break;
                }

                jsdocContinuation = nextLineNotEmptyOrEnd && !JS_DOC_REGEX.test(nextLine);
              }

              if (insideCodeBlock || isCurrentLineEmpty || isCurrentLineJSDoc) {
                continue;
              }

              if (!isCurrentLineEmpty && !BLOCK_COMMENT_LINE_START.test(line)) {
                context.report({ node: comment, messageId: 'invalidBlockCommentLine', data: { ...lineData } });
                break;
              }

              if (isListItem) {
                const listItemText = line.replace(LIST_ITEM, '');

                if (listItemText[0] !== ' ') {
                  context.report({ node: comment, messageId: 'invalidListItem', data: { ...lineData } });
                  break;
                }

                continue;
              }

              if (newParagraph && !jsdocContinuation) {
                const text = line.replace(/^\s*\*\s*/, '');
                const firstChar = text[0];

                if (isLetter(firstChar) && !(isCapital(firstChar) || isCapitalizedOrAllowed(text, ignoredWords))) {
                  context.report({ node: comment, messageId: 'paragraphCapitalized', data: { ...lineData } });
                  break;
                }
              }

              jsdocContinuation = jsdocContinuation && nextLineNotEmptyOrEnd;
              newParagraph = isNextLineEmpty && !isLastContentLine;

              if (isNextLineEmpty || isLastContentLine || isNextLineCodeBlock) {
                const lastChar = line[line.length - 1];

                if (isLastContentLine && !allowedParagraphEndings.some((ending) => ending === lastChar)) {
                  context.report({ node: comment, messageId: 'shouldEndWithDot', data: { ...lineData } });
                  break;
                }

                if (!isLastContentLine && !allowedParagraphEndings.some((ending) => ending === lastChar)) {
                  context.report({
                    node: comment,
                    messageId: 'invalidParagraphEnding',
                    data: { ...lineData, allowedParagraphEndings: `[${allowedParagraphEndings.join(' ')}]` },
                  });

                  break;
                }
              }
            }
          }
        }
      },
    };
  },
});
