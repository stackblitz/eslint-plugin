import { stripIndent } from 'common-tags';
import { fromFixture } from 'eslint-etc';
import rule, { messageId, ruleName } from '../../src/rules/block-scope-case';
import { ruleTester } from '../utils';

ruleTester().run(ruleName, rule, {
  valid: [
    fromFixture(
      stripIndent`
        const foo = 1;

        switch (foo) {
          case 1: {
            break;
          }
        }
      `
    ),
    fromFixture(
      stripIndent`
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
      `
    ),
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
