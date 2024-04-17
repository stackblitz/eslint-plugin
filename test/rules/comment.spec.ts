import { stripIndent } from 'common-tags';
import { fromFixture } from 'eslint-etc';
import rule, { defaultOptions, ruleName } from '../../src/rules/comment-syntax';
import { ruleTester, ruleTesterForJSONC } from '../utils';

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
        /// <reference path="../../../../node_modules/@types/should_be_valid.d.ts" />
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
         * Parahraphs can end on an exclamation mark!
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Parahraphs can end on a question mark?
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
    fromFixture(
      stripIndent`
        /**
         * - do this
         * - do that
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * 1. do this
         * 2. do that
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * 1. foo
         *    bar
         * 2. baz
         *    unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * 1. foo
         *    bar
         *
         * 2. baz
         *    unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * 1. foo
         *    bar
         *    baz
         *
         * 2. Lorem ipsum dolor sit amet, consetetur
         *    sadipscing elitr, sed diam nonumy eirmod
         *    tempor.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * 1. foo
         *    bar
         * Some paragraph in the middle.
         * 2. baz
         *    unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * 1. foo
         *    bar
         * 2. baz
         *    unicorn
         * Some paragraph at the end.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         *     1. foo
         *        bar
         *   2. baz
         *      unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * - foo
         *   bar
         * - baz
         *   unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * - foo
         *   bar
         *
         * - Lorem ipsum dolor sit amet, consetetur
         *   sadipscing elitr, sed diam nonumy eirmod
         *   tempor.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * - foo
         *   bar
         * Some paragraph in the middle.
         * - baz
         *   unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * - foo
         *   bar
         * - baz
         *   unicorn
         * Some paragraph at the end.
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         *   - foo
         *     bar
         *
         *     - baz
         *       unicorn
         */
      `
    ),
    fromFixture(
      stripIndent`
        /**
         * Some diagram:
         * \`\`\`
         * @ some text here
         * \`\`\`
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
        /**
         * -foo
         */
      `,
      errors: [
        {
          messageId: 'invalidListItem',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * 1.foo
         */
      `,
      errors: [
        {
          messageId: 'invalidListItem',
        },
      ],
    },
    {
      code: stripIndent`
        /**
         * - foo
         *    misaligned
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
         * 1. foo
         *     misaligned
         */
      `,
      errors: [
        {
          messageId: 'paragraphCapitalized',
        },
      ],
    },
  ],
});

ruleTesterForJSONC().run(ruleName, rule, {
  valid: [
    stripIndent`
      {
        // optional property
        "foo": "bar"
      }
    `,
    stripIndent`
      {
        /**
         * Non ut consequatur sint. Est animi excepturi porro molestiae ut in corrupti.
         */
        "lorem": true
      }
    `,
  ],
  invalid: [
    {
      code: stripIndent`
      {
        // Oopsie I've been a baaad boy.
        "despicable": 3
      }
      `,
      errors: [
        'Line comment cannot start with a capital letter unless the entire word is capitalized.',
        'Line comment cannot end with a dot.',
      ],
    },
  ],
});
