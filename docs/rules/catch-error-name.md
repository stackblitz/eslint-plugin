# `@blitz/catch-error-name`

> Enforce a specific name in catch clauses

Examples of incorrect code:

```ts
try {
  doSomething();
} catch (err) {
  // handle error
}
```

```ts
try {
  doSomething();
} catch (e) {
  // handle error
}
```

Examples of correct code:

```ts
try {
  doSomething();
} catch (error) {
  // handle error
}
```

## Options

```ts
type Options = [
  {
    name: string;
    ignore: string[];
  }
];

const defaultOptions: Options = {
  name: 'error',
  ignore: [],
};
```

### `name`

This option defines the name that is allowed in catch clauses.

### `ignore`

This option defines multiple names that get ignored.
