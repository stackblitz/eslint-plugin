import { stripIndent } from 'common-tags';
import rule from '@typescript-eslint/eslint-plugin/dist/rules/padding-line-between-statements';
import { ruleTester } from '../utils';

ruleTester().run(rule.name, rule, {
  valid: [
    {
      code: stripIndent`
        {
          bar();
        }

        bar();
      `,
    },
    {
      code: stripIndent`
        if (foo) {
          bar();
        }

        bar();
      `,
    },
    {
      code: stripIndent`
        while (Math.random() > 0.5) {
          bar();
        }

        with (String.prototype) {
          bar();
        }

        bar();
      `,
    },
  ],
  invalid: [
    {
      code: stripIndent`
      function foo() {
        {
          bar();
        }
        bar();
      }
      `,
      errors: [
        {
          messageId: 'expectedBlankLine',
        },
      ],
    },
    {
      code: stripIndent`
        if (foo) {
          bar();
        }
        bar();
      `,
      errors: [
        {
          messageId: 'expectedBlankLine',
        },
      ],
    },
    {
      code: stripIndent`
        while (Math.random() > 0.5) {
          bar();
        }
        with (String.prototype) {
          bar();
        }
        bar();
      `,
      errors: [
        {
          messageId: 'expectedBlankLine',
        },
      ],
    },
  ],
});
