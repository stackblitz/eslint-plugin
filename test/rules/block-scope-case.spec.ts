import { stripIndent } from 'common-tags';
import rule, { messageId, ruleName } from '../../src/rules/block-scope-case';
import { ruleTester } from '../utils';

ruleTester({
  name: ruleName,
  rule,
  valid: [
    {
      code: stripIndent`
        const foo = 1;

        switch (foo) {
          case 1: {
            break;
          }
        }
      `,
    },
    {
      code: stripIndent`
        const foo = 1;

        switch (foo) {
          case 1: {
            break;
          }
          case 2:
          case 3: {
            break;
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: stripIndent`
        const foo = 1;

        switch (foo) {
          case 1:
            break;
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
