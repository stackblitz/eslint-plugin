import type { TSESLint } from '@typescript-eslint/utils';
import { createRule } from '../util';
import { oneLine } from '../util/messages';

export const ruleName = 'comment-syntax';

export const defaultOptions = {
  ignoredWords: [] as string[],
  allowedParagraphEndings: ['.', ':', '`', ')', '}', ']', ';', '!', '?'],
};

type Options = [(typeof defaultOptions | undefined)?];

const SPACE_CHARCODE = ' '.charCodeAt(0);
const SLASH_CHARCODE = '/'.charCodeAt(0);
const STAR = '*';
const BLOCK_COMMENT_END = /^\s*$/;
const EMPTY_BLOCK_COMMENT_LINE = /^\s*\*$/;
const CODE_BLOCK = /^\s*\*\s+```/;
const BLOCK_COMMENT_LINE_START = /^\s*\*\s+.*/;
const JS_DOC_REGEX = /^\s*\*\s*@.+?/;
const LIST_ITEM = /^\s*\*\s*(?:-|\d\.)/;
const LIST_ITEM_INDENTATION = /^\s*\*(\s*(?:-|\d[.:)])\s*)/;

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

        const { sourceCode } = context;

        const comments = sourceCode.getAllComments();

        for (const comment of comments) {
          // start of the comment value, right after the `//` or `/*`
          const valueStart = comment.range[0] + 2;

          if (comment.type === 'Line') {
            const firstChar = comment.value?.charCodeAt(0);
            const secondChar = comment.value[1];
            const lastChar = comment.value[comment.value.length - 1];

            if (firstChar !== SPACE_CHARCODE && firstChar !== SLASH_CHARCODE && !isRegion(comment.value)) {
              context.report({
                node: comment,
                messageId: 'shouldStartWithSpace',
                fix: (fixer) => fixer.insertTextBeforeRange([valueStart, valueStart], ' '),
              });

              // if this one fails, the others are interpreted incorrectly
              continue;
            }

            if (
              isLetter(secondChar) &&
              isCapital(secondChar) &&
              !isCapitalizedOrAllowed(comment.value.slice(1), ignoredWords)
            ) {
              context.report({
                node: comment,
                messageId: 'lineCommentCapital',
                fix: (fixer) => fixer.replaceTextRange([valueStart + 1, valueStart + 2], secondChar.toLowerCase()),
              });
            }

            if (lastChar === '.' && !comment.value.endsWith('etc.') && !comment.value.endsWith('...')) {
              context.report({
                node: comment,
                messageId: 'lineCommentEnding',
                fix: (fixer) => fixer.removeRange([comment.range[1] - 1, comment.range[1]]),
              });
            }

            continue;
          }

          if (comment.type === 'Block') {
            let lines = comment.value.split('\n');

            if (lines.length <= 1) {
              // single line block comments are ignored
              continue;
            }

            const valueLines = lines;
            const indent = ' '.repeat(comment.loc.start.column + 1);

            const lineStartOffsets: number[] = [];

            let currentOffset = 0;

            for (const valueLine of valueLines) {
              lineStartOffsets.push(currentOffset);
              currentOffset += valueLine.length + 1;
            }

            // absolute source range of the line at `index` in the sliced `lines` array
            const lineRange = (index: number): [number, number] => {
              const start = valueStart + lineStartOffsets[index + 1];

              return [start, start + valueLines[index + 1].length];
            };

            // verify the first char is a '*'
            if (lines[0] !== STAR) {
              context.report({
                node: comment,
                messageId: 'shouldStartWithBlock',
                fix: (fixer) => {
                  const content = valueLines[0].replace(/^\*+\s*/, '').trim();
                  const range: [number, number] = [valueStart, valueStart + valueLines[0].length];

                  return fixer.replaceTextRange(range, content ? `*\n${indent}* ${content}` : '*');
                },
              });
              continue;
            }

            lines = lines.slice(1);

            let newParagraph = true;
            let insideCodeBlock = false;
            let jsdocContinuation = false;

            let prevListItemIndentation: number | undefined;

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
                  context.report({
                    node: comment,
                    messageId: 'shouldEndWithBlock',
                    fix: (fixer) => {
                      const [start] = lineRange(i);
                      const contentEnd = start + line.replace(/\s+$/, '').length;

                      return fixer.replaceTextRange([contentEnd, comment.range[1] - 2], `\n${indent}`);
                    },
                  });
                  break;
                }

                if (EMPTY_BLOCK_COMMENT_LINE.test(prevLine)) {
                  context.report({
                    node: comment,
                    messageId: 'noSpaceBeforeEnd',
                    fix: (fixer) => {
                      const [prevStart, prevEnd] = lineRange(i - 1);

                      return fixer.removeRange([prevStart - 1, prevEnd]);
                    },
                  });
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

              if (isCurrentLineJSDoc && !insideCodeBlock) {
                if (prevLine && !EMPTY_BLOCK_COMMENT_LINE.test(prevLine) && !JS_DOC_REGEX.test(prevLine)) {
                  context.report({
                    node: comment,
                    messageId: 'spaceBeforeJSDoc',
                    data: { ...lineData },
                    fix: (fixer) => {
                      const [start] = lineRange(i);

                      return fixer.insertTextBeforeRange([start, start], `${indent}*\n`);
                    },
                  });
                  break;
                }

                jsdocContinuation = nextLineNotEmptyOrEnd && !JS_DOC_REGEX.test(nextLine);
              }

              if (insideCodeBlock || isCurrentLineEmpty || isCurrentLineJSDoc) {
                continue;
              }

              if (!isCurrentLineEmpty && !BLOCK_COMMENT_LINE_START.test(line)) {
                context.report({
                  node: comment,
                  messageId: 'invalidBlockCommentLine',
                  data: { ...lineData },
                  fix: (fixer) => {
                    const [start] = lineRange(i);
                    const starMatch = line.match(/^\s*\*/);

                    if (starMatch) {
                      return fixer.insertTextAfterRange([start, start + starMatch[0].length], ' ');
                    }

                    const leadingWhitespace = line.match(/^\s*/)?.[0] ?? '';

                    return fixer.insertTextAfterRange([start, start + leadingWhitespace.length], '* ');
                  },
                });
                break;
              }

              if (isListItem) {
                const listItemText = line.replace(LIST_ITEM, '');
                const spaces = listItemText.match(/^(\s+)/g)?.[0].length;

                prevListItemIndentation = line.match(LIST_ITEM_INDENTATION)?.[1].length;

                if (spaces !== 1) {
                  context.report({
                    node: comment,
                    messageId: 'invalidListItem',
                    data: { ...lineData },
                    fix: (fixer) => {
                      return fixer.replaceTextRange(lineRange(i), line.replace(/^(\s*\*\s*(?:-|\d\.))\s*/, '$1 '));
                    },
                  });
                  break;
                }

                continue;
              }

              /**
               * If we saw a list item before we check if the current line has the same indentation.
               * If not, we simply continue.
               */
              if (prevListItemIndentation != null && prevListItemIndentation > 0) {
                const currentLineIdentation = line.match(/^\s*\*(\s*)/)?.[1].length;

                if (currentLineIdentation === prevListItemIndentation) {
                  continue;
                } else {
                  // indentation is different so we reset the state and continue with checking other rules
                  prevListItemIndentation = undefined;
                }
              }

              if (newParagraph && !jsdocContinuation) {
                const text = line.replace(/^\s*\*\s*/, '');
                const firstChar = text[0];

                if (isLetter(firstChar) && !(isCapital(firstChar) || isCapitalizedOrAllowed(text, ignoredWords))) {
                  context.report({
                    node: comment,
                    messageId: 'paragraphCapitalized',
                    data: { ...lineData },
                    fix: (fixer) => {
                      const [start] = lineRange(i);
                      const prefixLength = line.length - text.length;

                      return fixer.replaceTextRange(
                        [start + prefixLength, start + prefixLength + 1],
                        firstChar.toUpperCase(),
                      );
                    },
                  });
                  break;
                }
              }

              jsdocContinuation = jsdocContinuation && nextLineNotEmptyOrEnd;
              newParagraph = isNextLineEmpty && !isLastContentLine;

              if (isNextLineEmpty || isLastContentLine || isNextLineCodeBlock) {
                const lastChar = line[line.length - 1];

                const appendDot = (fixer: TSESLint.RuleFixer) => {
                  const [start] = lineRange(i);

                  return fixer.insertTextAfterRange([start, start + line.replace(/\s+$/, '').length], '.');
                };

                if (isLastContentLine && !allowedParagraphEndings.some((ending) => ending === lastChar)) {
                  context.report({
                    node: comment,
                    messageId: 'shouldEndWithDot',
                    data: { ...lineData },
                    fix: appendDot,
                  });
                  break;
                }

                if (!isLastContentLine && !allowedParagraphEndings.some((ending) => ending === lastChar)) {
                  context.report({
                    node: comment,
                    messageId: 'invalidParagraphEnding',
                    data: { ...lineData, allowedParagraphEndings: `[${allowedParagraphEndings.join(' ')}]` },
                    fix: appendDot,
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
