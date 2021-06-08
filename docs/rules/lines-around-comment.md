# `@blitz/lines-around-comment`

> Require empty lines around comments

## Rule Details

This rule extends the base [`eslint/lines-around-comment`](https://eslint.org/docs/rules/lines-around-comment) rule.
It adds support for allowing comments at the start and end of `Interface`'s and type literals.

## How to use

```cjson
{
  "@blitz/lines-around-comment": ["error"]
}
```

## Options

See [`eslint/lines-around-comment`](https://eslint.org/docs/rules/lines-around-comment#options-50) options.
This rule adds the following options:

```ts
interface Options extends BaseLinesAroundCommentOptions {
  allowInterfaceStart?: boolean;
  allowInterfaceEnd?: boolean;
}
```

It also overrides `allowObjectStart` and `allowObjectEnd` to work with type object literals.

### `allowInterfaceStart`

Example of a correct code when `allowInterfaceStart` is set to `true`:

```ts
interface InterfaceA {
  // some comment
  foo: boolean;
}

interface InterfaceA {
  /**
   * Some multi-line comment
   */
  foo: boolean;
}
```

### `allowInterfaceEnd`

Example of a correct code when `allowInterfaceEnd` is set to `true`:

```ts
interface InterfaceA {
  foo: boolean; // some comment
}

interface InterfaceA {
  foo: boolean /** comment */;
}
```
