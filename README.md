# @blitz/eslint-plugin

An ESLint plugin to enforce a consistent code styles across StackBlitz projects

## Installation

Install `@blitz/eslint-plugin` together with [ESLint](https://eslint.org) and [Prettier](https://prettier.io):

```
$ pnpm add -D eslint prettier @blitz/eslint-plugin
```

Requires ESLint `^9.38.0 || ^10.0.0`, Prettier 3 and Node.js `^20.19.0 || ^22.13.0 || >=24`.

## Usage

Add the recommended config to your `eslint.config.mjs`:

```js
import blitzPlugin from '@blitz/eslint-plugin';

export default [...blitzPlugin.configs.recommended()];
```

## Custom Rules

- [`@blitz/block-scope-case`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/block-scope-case.md)
- [`@blitz/catch-error-name`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/catch-error-name.md)
- [`@blitz/comment-syntax`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/comment-syntax.md)
- [`@blitz/lines-around-comment`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/lines-around-comment.md)
- [`@blitz/newline-before-return`](https://github.com/stackblitz/eslint-plugin/blob/master/docs/rules/newline-before-return.md)
