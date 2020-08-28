# `@blitz/block-scope-case`

> Ensures all case statements are block scoped.

Example of incorrect code:

```ts
const foo = 1;

switch (foo) {
  case 1:
    break;
  default:
    break;
}
```

The code above should be refactored to the following:

```ts
const foo = 1;

switch (foo) {
  case 1: {
    break;
  }
  default: {
    break;
  }
}
```
