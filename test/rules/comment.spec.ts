import { stripIndent } from 'common-tags';
import rule, { defaultOptions, ruleName } from '../../src/rules/comment-syntax';
import { ruleTester, ruleTesterForJSONC } from '../utils';

ruleTester({
  name: ruleName,
  rule,
  valid: [
    {
      code: stripIndent`
        // no capital or dots allowed here
      `,
    },
    {
      code: stripIndent`
        // SHOULD be valid
      `,
    },
    {
      code: stripIndent`
        // #region foo
      `,
    },
    {
      code: stripIndent`
        // #endregion foo
      `,
    },
    {
      code: stripIndent`
        // foo...
      `,
    },
    {
      code: stripIndent`
        // foo ...
      `,
    },
    {
      code: stripIndent`
        // foo etc.
      `,
    },
    {
      code: stripIndent`
        /// <reference path="../../../../node_modules/@types/should_be_valid.d.ts" />
      `,
    },
    {
      code: stripIndent`
        // \` should be valid
      `,
    },
    {
      code: stripIndent`
        /**
         * This should start with a capital and end with a dot.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Parahraphs can end on an exclamation mark!
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Parahraphs can end on a question mark?
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Foo:
         * \`\`\`
         * abc
         * \`\`\`
         * Some text.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * THIS should start with a capital and end with a dot.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * \` should be valid.
         */
      `,
    },
    {
      code: `
            /**
             * Content the replace the file with.
             */
      `,
    },
    {
      code: stripIndent`
        /**
         * Run a script from the \`package.json\`. Optionally you can provide \`env\` variables passed:
         * \`\`\`
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * @param {number} port
         * @param {string} coep
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * For example:
         * \`\`\`
         * foo
         *
         * bar
         * \`\`\`
         */
      `,
    },
    {
      code: stripIndent`
        new Int32Array(sharedArrayBuffer, 0 /* offset */, 1 /* length */);
      `,
    },
    {
      code: stripIndent`
        /* Denotes a text frame */
        TEXT = 0x1
      `,
    },
    {
      code: stripIndent`
        /**
         * Foobar
         * \`export default true\` --► \`const 𝐝𝐞𝐟𝐚𝐮𝐥𝐭 = true\`
         */
      `,
    },
    {
      code: stripIndent`
        //#region
      `,
    },
    {
      code: stripIndent`
        //#endregion
      `,
    },
    {
      code: stripIndent`
        /**
         * Some comment.
         *
         * @ref foo
         * @ref bar
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Some comment.
         *
         * @ref foo
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Some list:
         * - a
         * - b
         * - c
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Some comment.
         *
         * @ref foo
         *
         * Some other comment.
         *
         * @ref bar
         */
      `,
    },
    {
      code: stripIndent`
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
      `,
    },
    {
      code: stripIndent`
        /**
         * - do this
         * - do that
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * 1. do this
         * 2. do that
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * 1. foo
         *    bar
         * 2. baz
         *    unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * 1. foo
         *    bar
         *
         * 2. baz
         *    unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * 1. foo
         *    bar
         *    baz
         *
         * 2. Lorem ipsum dolor sit amet, consetetur
         *    sadipscing elitr, sed diam nonumy eirmod
         *    tempor.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * 1. foo
         *    bar
         * Some paragraph in the middle.
         * 2. baz
         *    unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * 1. foo
         *    bar
         * 2. baz
         *    unicorn
         * Some paragraph at the end.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         *     1. foo
         *        bar
         *   2. baz
         *      unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * - foo
         *   bar
         * - baz
         *   unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * - foo
         *   bar
         *
         * - Lorem ipsum dolor sit amet, consetetur
         *   sadipscing elitr, sed diam nonumy eirmod
         *   tempor.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * - foo
         *   bar
         * Some paragraph in the middle.
         * - baz
         *   unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * - foo
         *   bar
         * - baz
         *   unicorn
         * Some paragraph at the end.
         */
      `,
    },
    {
      code: stripIndent`
        /**
         *   - foo
         *     bar
         *
         *     - baz
         *       unicorn
         */
      `,
    },
    {
      code: stripIndent`
        /**
         * Some diagram:
         * \`\`\`
         * @ some text here
         * \`\`\`
         */
      `,
    },
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
