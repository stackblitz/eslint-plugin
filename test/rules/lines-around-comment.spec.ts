import { stripIndent } from 'common-tags';
import rule, { defaultOptions, ruleName } from '../../src/rules/lines-around-comment';
import { ruleTester, ruleTesterForJSONC } from '../utils';

ruleTester({
  name: ruleName,
  rule,
  valid: [
    {
      code: stripIndent`
        class Foo {
          // #region Foo
          add() {
            // todo
          }
          // #endregion
        }

        // #region Foo
        function add() {
          // todo
        }
        // #endregion
      `,
      options: {
        ...defaultOptions,
        allowClassStart: true,
        allowBlockStart: true,
      },
    },
    {
      // testing if the fallthrough to the base rule works
      code: stripIndent`
        class Foo {
          // some comment
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowClassStart: true,
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
          /* some comment */
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
          A,

          // some comment
          B,
        }
      `,
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          A,

          /* some comment */
          B,
        }
      `,
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          A,

          // some comment
          B,

          // another comment
          C,
        }
      `,
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          A,

          /* some comment */
          B,

          /* another comment */
          C,
        }
      `,
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      // allowed because it's an inline comment
      code: stripIndent`
        enum MyEnum {
          Value /* some comment */,
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowEnumEnd: false,
        },
      ],
    },
    {
      // allowed because it's considered an inline comment
      code: stripIndent`
        enum MyEnum {
          Value, /* some comment */
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowEnumEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          // some comment
          case 1: {}
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
          allowBlockStart: true,
        },
      ],
    },
    {
      code: `
        doSomething()
          // foo
          .a
          .b
          .c;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: true,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a

          // foo
          .b

          // foo
          .c;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: false,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a // foo
          .b // foo
          .c // foo;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: false,
        },
      ],
    },
    {
      code: `
        doSomething()
          /* foo */
          .a
          .b
          .c;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: true,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a

          /* foo */
          .b

          /* foo */
          .c;
      `,
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: `
        doSomething()
          /**
           * Some comment.
           */
          .a
          .b
          .c;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: true,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a

          /**
           * Some comment.
           */
          .b

          /**
           * Some comment.
           */
          .c;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: false,
        },
      ],
    },
    {
      code: `
        someIdentifier
          // foo
          .a
          .b
          .c;
      `,
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: true,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          // some comment
          case 1: {}
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
          case 1: {}
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
          case 1: {}
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
          /**
           * Some comment.
           */
          case 1: {}
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
          case 1: {}

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
          case 1: {}

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
          case 1: {}

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
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          /* some comment */
          x: 1
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          /**
           * Some commment.
           */
          x: 1
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          // some x
          x: 1;

          // some y
          y: 2;

          // some z
          z: 3;
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          // foo
          a: 1,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {

          // foo
          a: 1,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          /* some comment */
          a: 1,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {

          /* some comment */
          a: 1,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          /**
           * Some comment.
           */
          a: 1,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {

          /**
           * Some comment.
           */
          a: 1,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          // foo
          a: 1,

          // bar
          b: 2,

          // foobar
          c: 3,

          d: 3 /* some comment */,
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          a: 1,

          // foo
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          a: 1,

          /* some comment */
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          a: 1,

          /**
           * Some comment.
           */
        };
      `,
      options: [
        {
          ...defaultOptions,
          allowObjectEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          foo: {
            // foo
            a: 1;
          }
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowTypeStart: true,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          foo: {

            // foo
            a: 1;
          }
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowTypeStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          foo: {
            a: 1;

            // foo
          }
        }
      `,
      options: [
        {
          ...defaultOptions,
          allowTypeEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        if (true) {

        }
        // foo
        else if (true) {

        }
        // bar
        else if (true) {

        } else {

        }
      `,
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        enum MyEnum {
          Value,
          // some comment
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
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
          // some comment
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          A,
          // some comment
          B,
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowEnumStart: true,
          allowEnumEnd: true,
        },
      ],
    },
    {
      code: stripIndent`
        enum MyEnum {
          A,

          // some comment
          B,
          // other comment
          C,
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowEnumStart: true,
          allowEnumEnd: true,
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
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: stripIndent`
        const someArray = [
          /* foo */
          'foo',
          'bar',
        ];
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowArrayStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        const someArray = [
          'foo',
          'bar',

          /* foo */
        ];
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowArrayStart: false,
          allowArrayEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        const someArray = [
          'foo',
          'bar',

          // some comment
        ];
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowArrayStart: false,
          allowArrayEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        const someArray = [
          // some comment
          'foo',
          'bar',
        ];
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowArrayStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        const someArray = [
          /* some comment */
          'foo',
          'bar',
        ];
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowArrayStart: false,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a
          // foo
          .b;
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a
          .b
          // foo
          .c;
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: `
        doSomething()
          // foo
          .a
          .b
          .c;
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: false,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a
          /**
           * Some comment.
           */
          .b
          .c;
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: `
        doSomething()
          .a
          .b
          /**
           * Some comment.
           */
          .c;
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
        },
      ],
    },
    {
      code: `
        someIdentifier
          // foo
          .a
          .b
          .c;
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowMemberCallExpression: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          // some comment
          case 1: {}
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowSwitchStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          /* some comment */
          case 1: {}
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowSwitchStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          /**
           * Some comment.
           */
          case 1: {}
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowSwitchStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          case 1: {}

          // some comment
        }
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowSwitchEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          case 1: {}

          /* some comment */
        }
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowSwitchEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        switch (1) {
          case 1: {}

          /**
           * Some comment.
           */
        }
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowSwitchEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          // bar
          x: 1
        };
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowInterfaceStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          /* some comment */
          x: 1
        };
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowInterfaceStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          /**
           * Some commment.
           */
          x: 1
        };
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowInterfaceStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          // foo
          a: 1,
        };
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowObjectStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          /* some comment */
          a: 1,
        };
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowObjectStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          /**
           * Some comment.
           */
          a: 1,
        };
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowObjectStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          a: 1,

          // foo
        };
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowObjectEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          a: 1,

          /* some comment */
        };
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowObjectEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        const obj = {
          a: 1,

          /**
           * Some comment.
           */
        };
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowObjectEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          foo: {
            // foo
            a: 1;
          }
        }
      `,
      errors: [
        {
          messageId: 'before',
          message: 'Expected line before comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowTypeStart: false,
        },
      ],
    },
    {
      code: stripIndent`
        interface Foo {
          foo: {
            a: 1;

            // foo
          }
        }
      `,
      errors: [
        {
          messageId: 'after',
          message: 'Expected line after comment.',
        },
      ],
      options: [
        {
          ...defaultOptions,
          allowTypeEnd: false,
        },
      ],
    },
    {
      code: stripIndent`
        class Foo {
          // #region Foo
          add() {
            // todo
          }
          // #endregions
        }

        // #region Foo
        function add() {
          // todo
        }
        // #endregions
      `,
      errors: [
        {
          messageId: 'before',
        },
        {
          messageId: 'before',
        },
      ],
      options: {
        ...defaultOptions,
        allowClassStart: true,
        allowBlockStart: true,
      },
    },
    {
      code: stripIndent`
        // #region Foo
        function add() {
          // todo
        }
        // #foo
      `,
      errors: [
        {
          messageId: 'before',
        },
      ],
      options: {
        ...defaultOptions,
        allowBlockStart: true,
      },
    },
  ],
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
