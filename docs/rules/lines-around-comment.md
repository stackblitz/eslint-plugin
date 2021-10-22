# `@blitz/lines-around-comment`

> Require empty lines around comments

## Rule Details

This rule extends the base [`eslint/lines-around-comment`](https://eslint.org/docs/rules/lines-around-comment) rule.
It adds support for allowing comments at the start and end of `interface`'s, type literals and `enum`s.

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
  allowSwitchStart?: boolean;
  allowSwitchEnd?: boolean;
  allowEnumStart?: boolean;
  allowEnumEnd?: boolean;
  allowInterfaceStart?: boolean;
  allowInterfaceEnd?: boolean;
  allowMemberCallExpression?: boolean;
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

### `allowEnumStart`

Example of a correct code when `allowEnumStart` is set to `true`:

```ts
enum MyEnum {
  // some comment
  Value,
}

enum MyEnum {
  /**
   * Some multi-line comment
   */
  Value,
}
```

### `allowEnumEnd`

Example of a correct code when `allowEnumEnd` is set to `true`:

```ts
enum MyEnum {
  // some comment
  Value,
}

enum MyEnum {
  Value /* some comment */,
}

enum MyEnum {
  Value,
  /** comment */
}
```

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
