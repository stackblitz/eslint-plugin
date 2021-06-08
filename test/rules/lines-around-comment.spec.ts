import { stripIndent } from 'common-tags';
import rule, { ruleName, defaultOptions } from '../../src/rules/lines-around-comment';
import { ruleTester } from '../utils';

ruleTester().run(ruleName, rule, {
  valid: [
    {
      code: stripIndent`
        interface Foo {
          // bar
          x: 1
        };
      `,
      options: [
        {
          ...defaultOptions,
          beforeLineComment: true,
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        export interface Foo {
          x: {
            // bar
            [key: string]: string;
          };
        }
      `,
      options: [
        {
          ...defaultOptions,
          beforeLineComment: true,
          allowObjectStart: true,
        },
      ],
    },
  ],
  invalid: [],
});
