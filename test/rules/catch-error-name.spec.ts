import { stripIndent } from 'common-tags';
import rule, { ruleName } from '../../src/rules/catch-error-name';
import { ruleTester } from '../utils';

ruleTester().run(ruleName, rule, {
  valid: [
    {
      code: stripIndent`
        try {} catch (error) {}
      `,
    },
  ],
  invalid: [
    {
      code: stripIndent`
        try {} catch (err) {}
      `,
      errors: [
        {
          messageId: 'default',
        },
      ],
      output: stripIndent`
        try {} catch (error) {}
      `,
    },
    {
      code: stripIndent`
        try {} catch (e) {}
      `,
      errors: [
        {
          messageId: 'default',
        },
      ],
      output: stripIndent`
        try {} catch (error) {}
      `,
    },
  ],
});
