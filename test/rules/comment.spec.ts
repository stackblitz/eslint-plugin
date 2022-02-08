import { stripIndent } from 'common-tags';
import { fromFixture } from 'eslint-etc';
import rule, { ruleName } from '../../src/rules/comment';
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
          messageId: 'blockCommentCapital',
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
          messageId: 'blockCommentEnding',
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
          messageId: 'shouldStartWithBlock',
        },
      ],
    },
  ],
});
