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
  invalid: [],
});
