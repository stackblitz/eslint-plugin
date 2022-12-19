# @blitz/eslint-plugin

An ESLint plugin to enforce a consistent code styles across StackBlitz projects

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ yarn add -D eslint
```

Next, install `@blitz/eslint-plugin`:

```
$ yarn add -D @blitz/eslint-plugin
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `@blitz/eslint-plugin` globally.

## Usage

Add `@blitz/eslint-plugin` to the extends section of your `.eslintrc.js` or `.eslintrc.json` configuration file and
and configure `parser` and `parserOptions`. For the plugin, you can omit the `eslint-plugin-`:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module",
    "ecmaFeatures": {
      "modules": true
    }
  },
  "extends": ["plugin:@blitz/recommended"]
}
```

## Custom Rules

- [`@blitz/block-scope-case`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/block-scope-case.md)
- [`@blitz/catch-error-name`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/catch-error-name.md)
- [`@blitz/comment-syntax`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/comment-syntax.md)
- [`@blitz/lines-around-comment`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/lines-around-comment.md)
- [`@blitz/newline-before-return`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/newline-before-return.md)
