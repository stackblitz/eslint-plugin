import { stripIndent } from 'common-tags';
import rule, { ruleName } from '../../src/rules/catch-error-name';
import { ruleTester } from '../utils';

ruleTester({
  name: ruleName,
  rule,
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
      output: 'try {} catch (error) {}',
    },
    {
      code: stripIndent`
        try {
        } catch (e) {}
      `,
      errors: [
        {
          messageId: 'default',
        },
      ],
      output: stripIndent`
        try {
        } catch (error) {}
      `,
    },
    {
      // references to the parameter are renamed as well
      code: stripIndent`
        try {} catch (err) {
          console.log(err.message, err);
        }
      `,
      errors: [
        {
          messageId: 'default',
        },
      ],
      output: stripIndent`
        try {} catch (error) {
          console.log(error.message, error);
        }
      `,
    },
    {
      // the configured name is used, not a hardcoded one
      code: stripIndent`
        try {} catch (error) {}
      `,
      options: [
        {
          name: 'exception',
          ignore: [],
        },
      ],
      errors: [
        {
          messageId: 'default',
        },
      ],
      output: stripIndent`
        try {} catch (exception) {}
      `,
    },
    {
      // no fix when the expected name is already used inside the catch block
      code: stripIndent`
        try {} catch (err) {
          const error = 1;
          console.log(err, error);
        }
      `,
      errors: [
        {
          messageId: 'default',
        },
      ],
      output: null,
    },
  ],
});
