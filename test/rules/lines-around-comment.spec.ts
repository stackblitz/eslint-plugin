import { stripIndent } from 'common-tags';
import rule, { ruleName, defaultOptions } from '../../src/rules/lines-around-comment';
import { ruleTester, ruleTesterForJSONC } from '../utils';

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
    {
      code: stripIndent`
        enum MyEnum {
          // some comment
          Value,
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowEnumStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          Value,
          // some comment
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowEnumEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          Value /* some comment */,
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowEnumEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          Value,
          /* some comment */
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowEnumEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          /**
           * Some comment.
           */
          case 1: {
            // todo
          }
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowSwitchStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          /* some comment */
          case 1: {
            // todo
          }
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowSwitchStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          // some comment
          case 1: {
            // todo
          }
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowSwitchStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          case 1: {
            // todo
          }
          // some comment
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowSwitchEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          case 1: {
            // todo
          }
          /* some comment */
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowSwitchEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          case 1: {
            // todo
          }
          /**
           * Some comment.
           */
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowSwitchEnd: true,
        },
      ],
    },
  ],
  invalid: [],
});

ruleTesterForJSONC().run(ruleName, rule, {
  valid: [
    {
      code: stripIndent`
        {
          "version": 0,

          // optional property
          "foo": "bar"
        }
      `,
      options: [
        {
          beforeLineComment: true,
        },
      ],
    },
    {
      code: stripIndent`
        {
          "ipsum": "wut",

          /**
           * Non ut consequatur sint. Est animi excepturi porro molestiae ut in corrupti.
           */
          "lorem": true
        }
      `,
      options: [
        {
          beforeLineComment: true,
        },
      ],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        {
          "a": {
            "b": "c"
          },
          // oh nooo
          "b": 0
        }
      `,
      output: stripIndent`
        {
          "a": {
            "b": "c"
          },

          // oh nooo
          "b": 0
        }
      `,
      options: [
        {
          beforeLineComment: true,
        },
      ],
      errors: ['Expected line before comment.'],
    },
  ],
});
