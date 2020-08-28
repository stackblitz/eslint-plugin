# `@blitz/block-scope-case`

> Require an empty line before 'return' statements, only for block statemenet with more than 2 nodes

Examples of incorrect code:

```ts
function foo() {
  const foo = 1;
  const bar = 2;
  return foo && bar;
}
```

```ts
function foo() {
  if (someVariable) {
    // do something
  }
  return foo && bar;
}
```

Examples of correct code:

```ts
function foo() {
  const foo = 1;
  const bar = 2;

  return foo && bar;
}
```

```ts
function foo() {
  // some comment
  return true;
}
```

```ts
function foo() {
  if (someVariable) {
    return false;
  }

  return true;
}
```
