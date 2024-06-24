# `@blitz/lines-around-comment`

> Require empty lines around comments

## Rule Details

This rule extends the base [`@stylistic/ts/lines-around-comment`](https://eslint.style/rules/ts/lines-around-comment) rule.
It adds support for allowing comments at the start and end of `switch` statements, and fixes a bug with enums, arrays, and object literals.

## How to use

```cjson
{
  "@blitz/lines-around-comment": ["error"]
}
```

## Options

See [`@stylistic/ts/lines-around-comment`](https://eslint.style/rules/ts/lines-around-comment#options) options.
This rule adds the following options:

```ts
interface Options extends BaseRuleOptions {
  allowSwitchStart?: boolean;
  allowSwitchEnd?: boolean;
  allowMemberCallExpressionStart?: boolean;
}
```

It also overrides `allowObjectStart` and `allowObjectEnd` to work with type object literals.

### `allowSwitchStart`

Example of a correct code when `allowSwitchStart` is set to `true`:

```ts
switch (someValue) {
  // some comment
  case 'foo': {
    // todo
  }
}

switch (someValue) {
  /* some comment */
  case 'foo': {
    // todo
  }
}

switch (someValue) {
  /**
   * Some comment.
   */
  case 'foo': {
    // todo
  }
}
```

### `allowSwitchEnd`

Example of a correct code when `allowSwitchEnd` is set to `true`:

```ts
switch (someValue) {
  case 'foo': {
    // todo
  }
  // some comment
}

switch (someValue) {
  case 'foo': {
    // todo
  }
  /* some comment */
}

switch (someValue) {
  case 'foo': {
    // todo
  }
  /**
   * Some comment.
   */
}
```

### `allowMemberCallExpression`

Example of a correct code when `allowMemberCallExpression` is set to `true`:

```ts
doSomething()
  // some comment
  .a.b.c.d.replace('', '');

doSomething()
  .a // some comment
  .b // some comment
  .c // some comment
  .d.replace('', '');

doSomething()
  // some comment
  .doSomeMore('', '')
  // some comment
  .doSomeMore('', '')
  // some comment
  .doSomeMore('', '');

someIdentifier
  // some comment
  .someFn('', '');
```
