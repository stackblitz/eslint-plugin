import { stripIndent } from 'common-tags';
import rule, { messageId, ruleName } from '../../src/rules/newline-before-return';
import { ruleTester } from '../utils';

ruleTester().run(ruleName, rule, {
  valid: [
    {
      code: stripIndent`
        function foo() {
          return 1;
        }
      `,
    },
    {
      code: stripIndent`
        function foo() {
          const foo = 1;
          return foo;
        }
      `,
    },
    {
      code: stripIndent`
        function foo() {
          const foo = 1;

          // some comment
          return foo;
        }
      `,
    },
    {
      code: stripIndent`
        function foo() {
          const foo = 1;

          /**
           * some multi-line comment
           */
          return foo;
        }
      `,
    },
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
