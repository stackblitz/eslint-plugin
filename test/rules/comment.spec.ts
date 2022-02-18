import { stripIndent } from 'common-tags';
import { fromFixture } from 'eslint-etc';
import rule, { defaultOptions, ruleName } from '../../src/rules/comment';
import { ruleTester } from '../utils';

ruleTester().run(ruleName, rule, {
  valid: [
    fromFixture(
      stripIndent`
        // no capital or dots allowed here
      `
    ),
    fromFixture(
      stripIndent`
        // SHOULD be valid
      `
    ),
    fromFixture(
      stripIndent`
        // \` should be valid
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * This should start with a capital and end with a dot.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Foo:
         * \`\`\`
         * abc
         * \`\`\`
         * Some text.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * THIS should start with a capital and end with a dot.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * \` should be valid.
         */
      `
    ),
    fromFixture(
      `
            /**
             * Content the replace the file with.
             */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Run a script from the \`package.json\`. Optionally you can provide \`env\` variables passed:
         * \`\`\`
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * @param {number} port
         * @param {string} coep
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * For example:
         * \`\`\`
         * foo
         *
         * bar
         * \`\`\`
         */
      `
    ),
    fromFixture(
      stripIndent`
        new Int32Array(sharedArrayBuffer, 0 /* offset */, 1 /* length */);
      `
    ),
    fromFixture(
      stripIndent`
        /* Denotes a text frame */
        TEXT = 0x1
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Foobar
         * \`export default true\` --► \`const 𝐝𝐞𝐟𝐚𝐮𝐥𝐭 = true\`
         */
      `
    ),
    fromFixture(
      stripIndent`
        //#region
      `
    ),
    fromFixture(
      stripIndent`
        //#endregion
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some comment.
         *
         * @ref foo
         * @ref bar
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some comment.
         *
         * @ref foo
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some list:
         * - a
         * - b
         * - c
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some comment.
         *
         * @ref foo
         *
         * Some other comment.
         *
         * @ref bar
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some comment.
         *
         * @ref foobar
         * foobar
         * foobar.
         *
         * @ref foobar
         * foobar.
         */
      `
    ),
    {
      code: stripIndent`
          /**
           * refTableSize:uint32_t (previously used for sanity checks; safe to ignore)
           */
        `,
      options: [
        {
          ...defaultOptions,
          ignoredWords: ['refTableSize'],
        },
      ],
    },
    {
      code: stripIndent`
         // Map<Hostname, IP>
        `,
      options: [
        {
          ...defaultOptions,
          ignoredWords: ['Map'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: stripIndent`
              //should throw
            `,
      errors: [
        {
          messageId: 'shouldStartWithSpace',
        },
      ],
    },
    {
      code: stripIndent`
              // THiS throw
            `,
      errors: [
        {
          messageId: 'lineCommentCapital',
        },
      ],
    },
    {
      code: stripIndent`
              // Should throw
            `,
      errors: [
        {
          messageId: 'lineCommentCapital',
        },
      ],
    },
    {
      code: stripIndent`
              // should throw for the .
            `,
      errors: [
        {
          messageId: 'lineCommentEnding',
        },
      ],
    },
    {
      code: stripIndent`
              /**
               * should throw for the lack of capital.
               */
            `,
      errors: [
        {
          messageId: 'paragraphCapitalized',
        },
      ],
    },
    {
      code: stripIndent`
                /**
                 * Should throw for the lack of capital
                 */
              `,
      errors: [
        {
          messageId: 'shouldEndWithDot',
        },
      ],
    },
    {
      code: stripIndent`
                /**               * Should throw for lack of newline.
                 */
            `,
      errors: [
        {
          messageId: 'shouldStartWithBlock',
        },
      ],
    },
    {
      code: stripIndent`
                /**
                 *Should throw for the lack of a space.
                 */
            `,
      errors: [
        {
          messageId: 'invalidBlockCommentLine',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * Some Headline
         * \`\`\`
         * abc
         * \`\`\`
         * lowercase.
         */
      `,
      errors: [
        {
          messageId: 'invalidParagraphEnding',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * Some Headline:
         * \`\`\`
         * abc
         * \`\`\`
         * lowercase.
         */
      `,
      errors: [
        {
          messageId: 'paragraphCapitalized',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * Some comment.
         *
         * @todo some jsdoc
         * on multiple lines.
         * @todo another todo
         */
      `,
      errors: [
        {
          messageId: 'spaceBeforeJSDoc',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * Some comment.
         *
         * @todo a
         *
         * Some other comment.
         * @ref b
         */
      `,
      errors: [
        {
          messageId: 'spaceBeforeJSDoc',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * Some list:
         * - a
         * -b
         */
      `,
      errors: [
        {
          messageId: 'invalidListItem',
        },
      ],
    },
  ],
});
