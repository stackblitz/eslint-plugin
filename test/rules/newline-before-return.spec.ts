import { stripIndent } from 'common-tags';
import { fromFixture } from 'eslint-etc';
import rule, { messageId, ruleName } from '../../src/rules/newline-before-return';
import { ruleTester } from '../utils';

ruleTester().run(ruleName, rule, {
  valid: [
    fromFixture(
      stripIndent`
        function foo() {
          return 1;
        }
      `
    ),
    fromFixture(
      stripIndent`
        function foo() {
          const foo = 1;
          return foo;
        }
      `
    ),
    fromFixture(
      stripIndent`
        function foo() {
          const foo = 1;

          // some comment
          return foo;
        }
      `
    ),
    fromFixture(
      stripIndent`
        function foo() {
          const foo = 1;

          /**
           * some multi-line comment
           */
          return foo;
        }
      `
    ),
  ],
  invalid: [
    {
      code: stripIndent`
        function foo() {
          const foo = 1;
          const bar = 2;
          return foo && bar;
        }
      `,
      errors: [
        {
          messageId,
        },
      ],
    },
    {
      code: stripIndent`
        function foo() {
          const foo = 1;

          if (foo) {
            // do some work
          }
          return 1;
        }
      `,
      errors: [
        {
          messageId,
        },
      ],
    },
  ],
});
